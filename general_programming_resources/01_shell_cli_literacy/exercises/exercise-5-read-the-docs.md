# Exercise 5: Read the Docs, Set a Variable

## Goal
Practice finding a flag you've never used by reading real `--help` output instead of guessing or searching online, and set/use an environment variable to see exactly how far its scope actually reaches.

## Scenario
`examples/sample_project/logs/match_12.log` has two `ERROR` lines. `grep ERROR` alone shows you those two lines and nothing else. Sometimes the useful information is in the lines *around* a match, not just the match itself.

## Steps
1. Run `grep --help` (or `man grep` if `--help` isn't available on your system) and find the flag that prints a number of lines of **context** around each match, not just the matching line itself.
   
2. Use that flag against `examples/sample_project/logs/match_12.log`, searching for `ERROR`, asking for 1 line of context. Confirm you can now see the line immediately before and after each error, not just the error line itself.
   
3. `export` a new environment variable called `SCOUTING_TEAM` set to your team number (or any number, if you don't have one handy). Confirm it's set with `echo $SCOUTING_TEAM`.
   
4. Open a **new** terminal tab or window — not a new terminal application, a new session of the same shell — and run `echo $SCOUTING_TEAM` there. Is it set? Based on `concept.md`'s Environment Variables section, explain why or why not.

## Self-Check
- [ ] I found and named the correct `grep` context flag by reading `--help`/`man`, not by searching online or guessing
- [ ] My context-flag command correctly shows the line before and after each `ERROR`
- [ ] `SCOUTING_TEAM` was set and printed correctly in the terminal where I ran `export`
- [ ] I can explain, in one sentence, why a brand-new terminal session doesn't see it

## Reflection
The `grep` flag in this exercise wasn't covered anywhere in `concept.md` on purpose. The point isn't that specific flag, it's proving to yourself that `--help` actually gets you to an unfamiliar flag faster than you'd expect, for a tool you already use constantly. And step 4 makes "your current shell session" from the Environment Variables section concrete instead of abstract: `export` only ever affects the one session it was run in, which is exactly why a value you need every time (rather than just once) belongs in a shell config file, not typed by hand each session.
