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
import type { StoredEntry } from "./types.ts";
import { fetchRecentEntries, isSupabaseConfigured } from "./api/supabase.ts";

export function App() {
  const [entries, setEntries] = useState<StoredEntry[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  function handleEntrySaved(entry: StoredEntry) {
    setEntries((prev) => [entry, ...prev]);
  }

  // Load whatever's already in the database once, on mount. If Supabase
  // isn't configured, this is a no-op and the app behaves exactly like
  // web_fundamentals_primer's version: in-memory only, empty on load.
  // This is the actual payoff of persisting data at all -- refresh the
  // page and your entries are still here.
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    fetchRecentEntries()
      .then((fetched) => setEntries(fetched))
      .catch((error) => {
        setLoadError(error instanceof Error ? error.message : "Could not load saved entries.");
      });
  }, []);

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
        <p className="data-source-note">
          {isSupabaseConfigured
            ? "Connected to Supabase — entries persist across refreshes."
            : "Not connected to a database — entries only last as long as this tab is open. See 02_data_beyond_the_spreadsheet/concept.md."}
        </p>
        {loadError && <p className="team-lookup-error">{loadError}</p>}
        <ScoutingForm onEntrySaved={handleEntrySaved} />
        <EntryList entries={entries} />
      </main>
    </>
  );
}
