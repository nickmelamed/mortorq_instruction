# Exercise 1: Read the Traceback

## Goal
Use the reproduce -> isolate -> hypothesize -> test -> fix loop, and stack-trace reading, to find and fix a real crash.

## Scenario
`examples/stack_trace_bug/` has the same bug in three languages — `scouting_report.py`, `ScoutingReport.java`, `scouting_report.cpp` — each one builds a short scouting report and crashes on the second entry, for a language-shaped reason. Pick whichever you're comfortable with, or work through more than one to see the same lesson survive the trip across languages.

## Steps
1. **Reproduce.**
   - Python: `python3 scouting_report.py`
   - Java: `javac ScoutingReport.java && java ScoutingReport`
   - C++: `g++ -g -std=c++17 -o scouting_report scouting_report.cpp && ./scouting_report`

   Confirm it crashes the same way every time, right after printing one correct line first.

2. **Read the trace**, in the direction `concept.md` describes for your language (bottom-up for Python, top-down for Java, `lldb`'s `bt` for C++ — see `concept.md` for the exact command). What's the exception type/crash reason, and which function, on which line, is where things actually broke?

3. **Isolate.** The crash only happens on the second entry.
   - Python: temporarily remove the second dictionary from the `entries` list and confirm the crash goes away.
   - Java/C++: temporarily comment out the second `formatEntry` call (and its `println`) and confirm the crash goes away.

4. **Hypothesize.** Look at how the two team-number arguments actually differ from each other — Python: their types; Java: their types; C++: the exact characters in each string. State one specific, falsifiable guess about why the lookup fails for the second one and not the first.

5. **Test.** Confirm your hypothesis directly, before changing anything.
   - Python: print `type(...)` for a working entry's team number next to the broken one's.
   - Java: use a debugger watch (or a printed value) to check the type actually passed into `getTeamName`.
   - C++: use `lldb`'s `print` on the two team-number strings, or print their lengths, and compare.

6. **Fix.** Make the smallest change that resolves the confirmed cause, then restore the second entry/call and rerun the *original*, unmodified file to confirm it now runs cleanly end to end.

## Self-Check
- [ ] I can state the exact exception type/crash reason and the exact line where it happened, without looking it up again
- [ ] I confirmed which entry/call is responsible by isolating it, not just by reading the code and guessing
- [ ] My hypothesis about the root cause was confirmed by direct evidence (a printed type, a printed value, an inspected variable) before I changed any code
- [ ] The original file (both entries/calls, unmodified) now runs to completion and prints both lines of the report

## Reflection
In every language, the exception was thrown inside the lookup helper (`get_team_name` in Python, `getTeamName` in Java and C++) — the innermost frame — but the actual mistake wasn't made there at all; that function just faithfully did what it was asked and failed because of a problem that existed *before* it was ever called. This is extremely common, and it's the same shape no matter which language's trace you were staring at: the line a trace points you to is where the program *noticed* something was wrong, not necessarily where the wrong thing *happened*. Isolating (step 3) and hypothesizing about the data itself (step 4), rather than staring at the line the trace highlighted, is what actually gets you to the real cause.
