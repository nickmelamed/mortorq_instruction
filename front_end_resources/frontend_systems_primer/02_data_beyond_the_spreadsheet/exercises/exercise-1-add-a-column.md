# Exercise 1: Add a Column, End to End

## Goal
Change the actual database schema and follow that change through every layer that touches it — the real-data version of the compiler-guided exercise from `web_fundamentals_primer/02_why_typescript`, except this time the source of truth is a SQL table, not just a TypeScript type.

## Prerequisite
A working Supabase connection (see this topic's `concept.md` "Putting it together" for setup). If you haven't set one up yet, do that first — this exercise doesn't work against the in-memory fallback.

## Scenario
Add a `climbed: boolean` field: whether the scouted robot climbed at the end of the match.

## Steps
1. In your Supabase project's SQL Editor, run `alter table entries add column climbed boolean not null default false;` — changing a live table, not just `schema.sql` (update that file too, afterward, so it stays an accurate record of the schema).
2. In `types.ts`, add `climbed: boolean` to `ScoutingEntry`.
3. Run `npx tsc --noEmit` and follow the compiler errors — same discipline as `02_why_typescript`'s exercise. You'll need to touch `api/supabase.ts` (both the row-to-entry and entry-to-row conversions), and add a real checkbox somewhere in `ScoutingForm.tsx`.
4. Submit an entry with the box checked, then refresh the page. Confirm the entry reloads from Supabase with `climbed` still `true` — not just that it displayed correctly before the refresh.
5. Check the row directly in Supabase's Table Editor to confirm the column actually has the value you expect, not just that the app claims it does.

## Self-Check
- [ ] The database column exists and matches what `schema.sql` now documents
- [ ] `npx tsc --noEmit` passes
- [ ] A submitted entry's climbed status survives a page refresh
- [ ] You confirmed the stored value directly in Supabase's Table Editor, not just through the app's UI

## Reflection
You changed the schema in two places that don't automatically stay in sync: the live database (via `alter table`) and `schema.sql` (a text file that's only accurate if someone remembers to update it). What would happen to a teammate who ran `schema.sql` against a fresh database next season, if you'd forgotten to update the file? What does that tell you about treating a schema file as documentation versus treating it as the actual source of truth?
