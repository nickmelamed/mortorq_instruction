# Exercise 1: Add a Manual "Retry Sync Now" Button

## Goal
Handle the case the browser's own `online` event doesn't reliably cover, by giving a scout a way to trigger a sync attempt themselves.

## Background
`App.tsx` currently only calls `syncPendingEntries()` from two places: once on mount, and once inside the `online` event listener. That covers the common case, but not every real one — some networks (a flaky venue router, a captive portal that briefly "connects" without real internet) can bring the browser back online technically without the `online` event firing in a way that matches what a scout actually experiences. Right now, if that happens, a scout with queued entries has no option but to wait and hope, with no way to just try again.

## Steps
1. In `App.tsx`, pull the inline `trySync` function (currently defined inside the `online`/`offline` `useEffect`) out to component scope, so it can be called from more than one place — from the effect *and* from a new button's `onClick`.
2. Add a `"Retry sync now"` button, visible only when `pendingIds.size > 0`, placed next to the existing "Syncing..." banner.
3. Give the button its own tiny status so a scout gets feedback from clicking it — a `retrying` boolean is enough here; this doesn't need a full state machine like `ScoutingForm`'s `SubmitStatus`, since there's no error path distinct from "still pending" to represent. Disable the button while `retrying` is true.
4. Test it: open dev tools, switch the Network tab to **Offline**, submit two entries, confirm both show "Pending sync." Switch back to **Online**, but *before* the automatic sync effect has a chance to fire, click your new button and confirm it flushes the queue exactly like the automatic path does.
5. `npx tsc --noEmit` passes.

## Self-Check
- [ ] The button only appears when there's actually something queued
- [ ] Clicking it while online flushes the pending queue and clears the matching badges
- [ ] The button is disabled while a sync attempt triggered by it is in flight
- [ ] `npx tsc --noEmit` passes

## Reflection
`syncPendingEntries()` is safe to call repeatedly and from multiple triggers at once — the mount effect, the `online` listener, and now this button could all end up calling it around the same moment. What about its actual implementation (in `api/scouting.ts`) makes calling it twice in quick succession harmless, instead of a source of duplicate Supabase writes?
