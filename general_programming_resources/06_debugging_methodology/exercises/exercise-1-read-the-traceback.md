# Exercise 1: Read the Traceback

## Goal
Use the reproduce -> isolate -> hypothesize -> test -> fix loop, and stack-trace reading, to find and fix a real crash — without just guessing at changes until it stops crashing.

## Scenario
`examples/stack_trace_bug/scouting_report.py` builds a short scouting report from a list of entries and a lookup of team numbers to team names. It crashes every time you run it.

## Steps
1. **Reproduce:** run `python3 scouting_report.py` and confirm it crashes the same way every time.
2. **Read the traceback bottom-up**, per `concept.md`: what's the exception type and message, at the very bottom? Which function, on which line, actually threw it?
3. **Isolate:** the script processes a list of two entries. Which one of the two is actually responsible? (Try temporarily removing one entry from the list at a time and see which removal makes the crash go away.)
4. **Hypothesize:** look at `team_lookup`'s keys and the `"team"` value on the entry you isolated in step 3. State a specific, one-sentence guess about why the lookup fails for this entry and not the other one.
5. **Test:** confirm your hypothesis directly — e.g., print `type(team_lookup_key)` for a working entry's team number next to `type(the_broken_entry["team"])`, and see if they actually differ the way you guessed.
6. **Fix:** make the smallest change that resolves the confirmed cause, then rerun the *original*, unmodified script (put back the entry you removed in step 3) to confirm it now runs cleanly end to end.

## Self-Check
- [ ] I can state the exact exception type and the exact line that threw it, without looking it up again
- [ ] I identified which of the two entries causes the crash, and confirmed it by testing (not just guessing)
- [ ] My hypothesis about the root cause was confirmed by direct evidence (a printed type, a printed value) before I changed any code
- [ ] The original script (both entries, unmodified) now runs to completion and prints both lines of the report

## Reflection
The exception was thrown inside `get_team_name` — the innermost frame in the traceback — but the actual mistake wasn't made there at all; `get_team_name` just faithfully did what it was asked and failed because of a problem that existed *before* it was ever called. This is extremely common: the line the traceback points you to is where the program noticed something was wrong, not necessarily where the wrong thing happened. Isolating (step 3) and hypothesizing about the data itself (step 4), rather than staring at the line the traceback highlighted, is what actually got you to the real cause.
