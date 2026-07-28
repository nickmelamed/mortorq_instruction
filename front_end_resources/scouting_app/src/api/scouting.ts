// api/scouting.ts -- saveEntry is the one function ScoutingForm calls to
// persist an entry. It decides, once, whether that means a real
// Supabase insert or the old in-memory fake -- callers don't need to
// know or care which happened, only that they get a StoredEntry back.

import type { ScoutingEntry, StoredEntry } from "../types.ts";
import { insertEntry, isSupabaseConfigured } from "./supabase.ts";

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
  if (isSupabaseConfigured) {
    return insertEntry(entry);
  }

  // Fallback: identical to every previous module's behavior, just
  // pushed behind this one decision point instead of being the only
  // option. The id is generated here instead of by a real database,
  // since there's no database to generate one.
  return fakeSubmitToServer({ ...entry, id: crypto.randomUUID() });
}
