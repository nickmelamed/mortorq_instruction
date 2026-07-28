// offline/pendingQueue.ts -- the local, on-device holding area for an
// entry that couldn't reach Supabase yet: offline entirely, or a request
// that started and never got a response before the connection dropped.
//
// localStorage, not IndexedDB: this queue is a handful of small JSON
// objects, read and written whole, all at once -- exactly what
// localStorage's plain, synchronous get/set-a-string API is good at.
// IndexedDB earns its keep once you need to query by field, store more
// than localStorage's ~5MB, or avoid blocking the main thread on a big
// read/write -- none of which is true here. See this topic's concept.md
// for where that line actually is.

import type { StoredEntry } from "../types.ts";

const STORAGE_KEY = "scouting-app:pending-entries";

export function getPendingEntries(): StoredEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredEntry[]) : [];
  } catch {
    // A corrupted or hand-edited value shouldn't take the whole app down --
    // treat it the same as "nothing queued yet."
    return [];
  }
}

function writePendingEntries(entries: StoredEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function enqueuePendingEntry(entry: StoredEntry): void {
  writePendingEntries([...getPendingEntries(), entry]);
}

export function removePendingEntry(id: string): void {
  writePendingEntries(getPendingEntries().filter((entry) => entry.id !== id));
}
