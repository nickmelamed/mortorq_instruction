# Exercise 2: Break the Idempotent Retry (On Purpose)

## Goal
See exactly what goes wrong once a retried write isn't idempotent anymore — and confirm it's a stuck queue, not a duplicate row, given how this app's ids actually work.

## Background
`concept.md` claims that swapping `upsert()` back to `insert()` in `api/supabase.ts` would break retries. This exercise makes you prove it, and prove *how* it breaks — which is more specific (and more useful to have actually seen) than "it would duplicate data," a guess that turns out to be wrong once you check `schema.sql` and see `id` is a `uuid primary key`.

## Steps
1. In `api/supabase.ts`, change `upsertEntry`'s `.upsert({ id: entry.id, ... }, { onConflict: "id" })` back to a plain `.insert({ id: entry.id, ... })`.
2. In `api/scouting.ts`'s `syncPendingEntries`, temporarily comment out the `removePendingEntry(entry.id);` line, right after a successful `upsertEntry(entry)` call. This simulates the exact failure this topic is about: a write that succeeds on the server, but the client never gets to find out.
3. In the running app: open dev tools, go **Offline**, submit one entry. Confirm it shows "Pending sync."
4. Go back **Online** and let the automatic sync run (or use your Exercise 1 button, if you built it). Open your Supabase project's Table Editor and confirm the row is there.
5. Trigger a sync a second time — toggle Offline then Online again, or reload the page while online. Watch what happens to that same entry's badge.
6. Check your browser's console for the actual error Supabase returned on that second attempt, and check the Table Editor again: how many rows exist for this entry now?
7. Revert both changes from steps 1 and 2, and confirm a fresh offline-then-online cycle syncs cleanly again with no console errors.

## Self-Check
- [ ] I confirmed the entry's row appears in Supabase after the first sync
- [ ] I can quote the actual Postgres/Supabase error text from the second sync attempt
- [ ] I confirmed there is exactly one row for this entry in the Table Editor, not two, after both attempts
- [ ] I reverted both changes and confirmed a real offline → online cycle syncs without errors again

## Reflection
The badge said "Pending sync" after step 5, but the data was already safely in Supabase after step 4. Which is the worse failure mode for a scout to actually experience at a competition: a genuinely duplicated row, or a correctly-saved entry that the UI incorrectly keeps claiming isn't saved yet — and why?
