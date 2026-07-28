# Exercise 1: Add Delete, as a State Machine

## Goal
Finally fix the bad entry you couldn't delete back in `01_foundations` — for real this time — and model the delete button's own status as a state machine from the start, instead of a boolean you'd have to refactor later.

## Background
`01_foundations/exercises/exercise-2-debug-the-delete-buttons.md` had you debug a broken delete button in the vanilla-JS version of this app. That version never got a real fix merged into the app itself — this exercise is that feature, built for real, in React, with a real (and therefore genuinely fallible) network call behind it.

## Steps
1. In `api/supabase.ts`, add `deleteEntryById(id: string): Promise<void>`, following `insertEntry`'s shape: a Supabase call, a thrown `Error` with a clear message if it fails.
2. In `api/scouting.ts`, add a `removeEntry(id: string): Promise<void>` that calls `deleteEntryById` when Supabase is configured, and does nothing (just resolves) when it isn't — entries in the fallback path only ever lived in memory, so there's nothing to delete from anywhere else.
3. In `EntryCard.tsx`, add a delete button. Give it its own local state machine — `{ phase: "idle" } | { phase: "deleting" } | { phase: "error"; message: string }` — the same shape `ScoutingForm`'s `SubmitStatus` uses. Disable the button while `phase === "deleting"`, and show the error message if the delete fails.
4. Wire an `onDeleted: (id: string) => void` callback from `App` down through `EntryList` to `EntryCard`, so a successful delete removes the entry from `App`'s `entries` state (the same "events flow up" shape `onEntrySaved` already uses).
5. Test the failure path deliberately: temporarily change `deleteEntryById` to always throw, confirm the error message displays and the card is *not* removed, then revert.

## Self-Check
- [ ] Deleting a real entry removes it from Supabase (check the Table Editor, not just the UI)
- [ ] While a delete is in flight, that card's button is disabled and the others are unaffected
- [ ] A failed delete shows an error message and leaves the card in place
- [ ] `npx tsc --noEmit` passes

## Reflection
`onDeleted` passes through `EntryList` on its way from `App` to `EntryCard` — exactly the same shape of "passes through a component that doesn't directly use it" that justified Context for `scouterName` in this topic's `concept.md`. Why didn't `onDeleted` get the same treatment? What's actually different between a callback like this and session-wide identity state that makes one a reasonable prop-drilling case and the other a Context case?
