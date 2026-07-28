// EntryList.tsx -- composition: this component doesn't know how to
// render one entry, and doesn't need to. It owns the "no entries yet"
// empty state and the grid layout, and delegates each individual card
// to EntryCard. This is "composition before global state" in practice --
// entries flows down from App as a single prop, three levels deep
// (App -> EntryList -> EntryCard), and nothing here reaches for
// anything like Context or a global store, because three shallow levels
// of props is genuinely simpler than the alternative at this size.

import type { StoredEntry } from "../types.ts";
import { EntryCard } from "./EntryCard.tsx";

interface EntryListProps {
  entries: StoredEntry[];
}

export function EntryList({ entries }: EntryListProps) {
  return (
    <section aria-labelledby="entries-heading">
      <h2 id="entries-heading">Recent entries</h2>
      <div className="entries-grid">
        {entries.length === 0 ? (
          <p>No entries yet — submit the form above.</p>
        ) : (
          // key={entry.id}, not key={index}: React uses this to match
          // up entries across re-renders. An index shifts every time an
          // entry is added to the front of the list (as this app does),
          // which would make React think every card changed identity on
          // every submission instead of one new card being added.
          entries.map((entry) => <EntryCard key={entry.id} entry={entry} />)
        )}
      </div>
    </section>
  );
}
