// App.tsx -- the top of the component tree, and the one place `entries`
// actually lives. ScoutingForm never sees the list of entries at all; it
// only ever hands a *new* one up through onEntrySaved. EntryList never
// creates an entry; it only ever receives the current list down through
// props. Neither component could accidentally desync from the other,
// because neither one owns a copy of the data -- there's exactly one
// copy, here, and everything else is a view of it or a way to change it.

import { useEffect, useState } from "react";
import { Header } from "./components/Header.tsx";
import { ScoutingForm } from "./components/ScoutingForm.tsx";
import { EntryList } from "./components/EntryList.tsx";
import type { ScoutingEntry, StoredEntry } from "./types.ts";

export function App() {
  const [entries, setEntries] = useState<StoredEntry[]>([]);

  function handleEntrySaved(entry: ScoutingEntry) {
    const stored: StoredEntry = { ...entry, id: crypto.randomUUID() };
    setEntries((prev) => [stored, ...prev]);
  }

  // Synchronizing with something outside React (document.title) -- the
  // textbook reason useEffect exists. No cleanup needed: setting a title
  // isn't acquiring anything that later needs releasing, unlike the
  // keydown listener in ScoutingForm.tsx.
  useEffect(() => {
    document.title = entries.length > 0 ? `1515 Match Scouting (${entries.length})` : "1515 Match Scouting";
  }, [entries.length]);

  return (
    <>
      <Header
        title="1515 Match Scouting"
        subtitle="React version — the same form, now built from components instead of hand-written DOM calls."
      />
      <main>
        <ScoutingForm onEntrySaved={handleEntrySaved} />
        <EntryList entries={entries} />
      </main>
    </>
  );
}
