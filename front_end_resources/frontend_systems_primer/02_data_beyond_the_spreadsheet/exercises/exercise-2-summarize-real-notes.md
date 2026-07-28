# Exercise 2: Summarize Real Notes

## Goal
Connect this topic's two halves: pull a team's real notes out of the database you just set up, and feed them into the LLM script instead of typing notes by hand on the command line.

## Prerequisite
A working Supabase connection with at least a few real submitted entries for one team (submit some through the app if you don't have any yet — try more than one team so you can confirm you're only summarizing the right one).

## Steps
1. In `scripts/summarize-team.ts`, replace the `notes` argument (currently read from `process.argv`) with a real query: fetch every entry for the given team number from Supabase, ordered however you like, and pull out just the `notes` field from each.
2. You'll need your own Supabase client in this script — it's a separate Node process from the browser app, so it can't import `api/supabase.ts` directly (that file reads `import.meta.env`, which only exists in Vite's browser build). Create the client the same way `api/supabase.ts` does, but read the URL and key from `process.env` instead — you'll need to export them in your shell the same way you export `ANTHROPIC_API_KEY`.
3. Handle the case where a team has zero entries in the database. Don't send an empty notes list to the LLM and hope for a reasonable answer — decide what should actually happen (a clear message and exit, most likely) and implement it explicitly. This is the same "empty state is not optional" argument from `01_consuming_apis`, now applied to a script instead of a UI.
4. Run it against a real team number you've actually submitted entries for, and confirm the summary reflects what you actually wrote in those notes.

## Self-Check
- [ ] The script pulls real notes from Supabase instead of `process.argv`
- [ ] Running it with a team number that has zero entries produces a clear message, not a malformed API call or a confusing model response
- [ ] The summary's content is traceable back to specific notes you actually submitted
- [ ] `ANTHROPIC_API_KEY` and your Supabase credentials are read from environment variables, not hardcoded anywhere in the script

## Reflection
This script now reads two different secrets from two different places (an Anthropic key, a Supabase key), both via environment variables, both never appearing in any file you'd commit to git. Why does that same rule — real secrets live in environment variables, never in source code — apply equally to both, even though one talks to an LLM and the other to a database? What do the two credentials have in common that makes the rule the same for both?
