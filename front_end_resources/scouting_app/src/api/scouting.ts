// api/scouting.ts -- saveEntry is the one function ScoutingForm calls to
// persist an entry. It decides, once, whether that means a real
// Supabase upsert, a local pending-queue entry, or the old in-memory
// fake -- callers don't need to know or care which happened, only that
// they get a StoredEntry back.
//
// As of 05_offline_and_multi_user: the id is generated here, up front,
// before any network call is attempted -- not by Supabase, and not only
// on the fallback path. That's what makes a queued-then-retried write
// idempotent: the same entry always upserts onto the same row, no matter
// how many times saveEntry's caller (or syncPendingEntries below) ends up
// asking Supabase to save it. See this topic's concept.md.

import type { ScoutingEntry, StoredEntry } from "../types.ts";
import { upsertEntry, isSupabaseConfigured } from "./supabase.ts";
import { enqueuePendingEntry, getPendingEntries, removePendingEntry } from "../offline/pendingQueue.ts";

// Still used directly when Supabase isn't configured. Keeps the delay
// and disabled-button UX from web_fundamentals_primer intact even
// without a real backend.
function fakeSubmitToServer<T>(entry: T): Promise<T> {
  return new Promise((resolve) => {
    const delayMs = 400 + Math.random() * 600;
    setTimeout(() => resolve(entry), delayMs);
  });
}

export async function saveEntry(entry: ScoutingEntry): Promise<StoredEntry> {
  const withId: StoredEntry = { ...entry, id: crypto.randomUUID() };

  if (!isSupabaseConfigured) {
    return fakeSubmitToServer(withId);
  }

  // No network to even attempt -- queue it immediately instead of making
  // a request the browser already knows will fail.
  if (!navigator.onLine) {
    enqueuePendingEntry(withId);
    return withId;
  }

  try {
    return await upsertEntry(withId);
  } catch (error) {
    // A real request failure (timeout, dropped mid-flight, venue wifi
    // doing what venue wifi does) gets exactly the same treatment as
    // being offline from the start: queue it locally so this scout's
    // entry doesn't just vanish because a request came back with an
    // error. It stays queued until the next successful sync.
    enqueuePendingEntry(withId);
    return withId;
  }
}

// Attempts to flush every locally-queued entry. Entries that fail again
// (still no real connectivity, or Supabase itself is down) are left in
// the queue for the next attempt -- this function never throws for a
// per-entry failure, only reports back what actually made it.
export async function syncPendingEntries(): Promise<{ synced: StoredEntry[] }> {
  if (!isSupabaseConfigured) {
    return { synced: [] };
  }

  const synced: StoredEntry[] = [];
  for (const entry of getPendingEntries()) {
    try {
      await upsertEntry(entry);
      removePendingEntry(entry.id);
      synced.push(entry);
    } catch {
      // Still not reachable -- leave it queued and move on to the rest.
    }
  }
  return { synced };
}
