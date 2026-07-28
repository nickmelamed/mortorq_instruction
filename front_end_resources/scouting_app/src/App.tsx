// App.tsx -- the top of the component tree, and the one place `entries`
// actually lives. ScoutingForm never sees the list of entries at all; it
// only ever hands a *new* one up through onEntrySaved. EntryList never
// creates an entry; it only ever receives the current list down through
// props. Neither component could accidentally desync from the other,
// because neither one owns a copy of the data -- there's exactly one
// copy, here, and everything else is a view of it or a way to change it.
//
// As of 03_state_as_a_systems_problem: also wraps everything in
// <ScouterIdentityProvider>, the app's one genuine use of Context -- see
// context/ScouterIdentityContext.tsx for why entries/handleEntrySaved
// below stayed as plain props while scouterName didn't.
//
// As of 05_offline_and_multi_user: also tracks which entries haven't
// reached Supabase yet (pendingIds) and the browser's own online/offline
// signal, and reconciles the local pending queue against the server both
// on mount and whenever connectivity comes back. onEntrySaved doesn't
// change at all -- api/scouting.ts's saveEntry() already hands back a
// StoredEntry whether it went straight to Supabase or into the local
// queue, so this component still only has one thing to do with it.

import { useEffect, useState } from "react";
import { Header } from "./components/Header.tsx";
import { ScouterBadge } from "./components/ScouterBadge.tsx";
import { ScoutingForm } from "./components/ScoutingForm.tsx";
import { EntryList } from "./components/EntryList.tsx";
import type { StoredEntry } from "./types.ts";
import { fetchRecentEntries, isSupabaseConfigured } from "./api/supabase.ts";
import { syncPendingEntries } from "./api/scouting.ts";
import { getPendingEntries } from "./offline/pendingQueue.ts";
import { ScouterIdentityProvider } from "./context/ScouterIdentityContext.tsx";

export function App() {
  const [entries, setEntries] = useState<StoredEntry[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  function handleEntrySaved(entry: StoredEntry) {
    setEntries((prev) => [entry, ...prev]);

    // saveEntry() already wrote this entry into the local queue (see
    // api/scouting.ts) before this promise ever resolved, if that's the
    // path it took -- checking the queue here, instead of having
    // saveEntry report its own outcome back, is what lets ScoutingForm
    // keep calling saveEntry() exactly the way it always has.
    if (getPendingEntries().some((pending) => pending.id === entry.id)) {
      setPendingIds((prev) => new Set(prev).add(entry.id));
    }
  }

  // Load whatever's already in the database, and whatever's still
  // waiting locally from a previous session, once on mount. If Supabase
  // isn't configured, this is a no-op past the pending queue and the app
  // behaves exactly like web_fundamentals_primer's version: in-memory
  // only, empty on load. This is the actual payoff of persisting data at
  // all -- refresh the page and your entries (synced or not) are still
  // here.
  useEffect(() => {
    const pending = getPendingEntries();
    setPendingIds(new Set(pending.map((entry) => entry.id)));

    if (!isSupabaseConfigured) {
      setEntries(pending);
      return;
    }

    fetchRecentEntries()
      .then((fetched) => {
        // A locally-queued entry that's already in the fetched list was
        // synced from somewhere else -- another tab, another device on
        // the same team -- while this one was still offline. Drop it
        // from the local queue instead of syncing (and duplicating) it
        // again; the multi-user half of this topic's name, in practice.
        const fetchedIds = new Set(fetched.map((entry) => entry.id));
        const stillPending = pending.filter((entry) => !fetchedIds.has(entry.id));
        setPendingIds(new Set(stillPending.map((entry) => entry.id)));
        setEntries([...stillPending, ...fetched]);
      })
      .catch((error) => {
        setLoadError(error instanceof Error ? error.message : "Could not load saved entries.");
        setEntries(pending);
      });
  }, []);

  // The offline/online signal itself, plus the actual sync trigger: try
  // to flush the pending queue the moment the browser says connectivity
  // is back, and once up front in case there was already a queue waiting
  // from a previous session and we mounted already-online.
  useEffect(() => {
    function trySync() {
      if (!isSupabaseConfigured || !navigator.onLine) return;
      syncPendingEntries().then(({ synced }) => {
        if (synced.length === 0) return;
        const syncedIds = new Set(synced.map((entry) => entry.id));
        setPendingIds((prev) => {
          const next = new Set(prev);
          syncedIds.forEach((id) => next.delete(id));
          return next;
        });
      });
    }

    function handleOnline() {
      setIsOnline(true);
      trySync();
    }
    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    trySync();
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Synchronizing with something outside React (document.title) -- the
  // textbook reason useEffect exists. No cleanup needed: setting a title
  // isn't acquiring anything that later needs releasing, unlike the
  // keydown listener in ScoutingForm.tsx.
  useEffect(() => {
    document.title = entries.length > 0 ? `1515 Match Scouting (${entries.length})` : "1515 Match Scouting";
  }, [entries.length]);

  return (
    <ScouterIdentityProvider>
      <div className="app-header">
        <Header
          title="1515 Match Scouting"
          subtitle="React version — the same form, now built from components instead of hand-written DOM calls."
        />
        <ScouterBadge />
      </div>
      <main>
        <p className="data-source-note">
          {isSupabaseConfigured
            ? "Connected to Supabase — entries persist across refreshes."
            : "Not connected to a database — entries only last as long as this tab is open. See 02_data_beyond_the_spreadsheet/concept.md."}
        </p>
        {loadError && <p className="team-lookup-error">{loadError}</p>}
        {!isOnline && (
          <p className="offline-banner" role="status">
            You're offline. New entries are being saved on this device and will sync automatically once you're back
            online.
          </p>
        )}
        {isOnline && pendingIds.size > 0 && (
          <p className="offline-banner" role="status">
            Syncing {pendingIds.size} {pendingIds.size === 1 ? "entry" : "entries"} saved while offline...
          </p>
        )}
        <ScoutingForm onEntrySaved={handleEntrySaved} />
        <EntryList entries={entries} pendingIds={pendingIds} />
      </main>
    </ScouterIdentityProvider>
  );
}
