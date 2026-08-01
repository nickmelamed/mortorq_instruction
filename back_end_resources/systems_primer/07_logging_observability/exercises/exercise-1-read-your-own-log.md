# Exercise 1: Read Your Own Log Like a Post-Mortem

## Goal
Treat `StructuredLoggingDemo.java`'s output the way you'd treat a real driver station log after a match: capture it, then answer specific questions using only the log, without re-reading the source code to get the answer. Then extend the logger to catch a real anomaly on its own.

## Setup
Work in `07_logging_observability/java/StructuredLoggingDemo.java`. Compile/run per `concept.md`'s commands, and redirect the output to a file by appending ` > run.log` to the `java` command.

## Part A — Answer these using only `run.log`

1. Search `run.log` for every line at `WARN` or `ERROR` level. How many are there, and are they from the "quick look at all three levels" preview at the top of `main()`, or from the actual autonomous run below it?
2. Find the exact `tick=` value where the state machine transitioned `from=TRANSPORT to=SCORE`. Do this with a single search command, not by scrolling and counting by eye.
3. Confirm, from the log alone, that exactly 3 transitions happened in this run — the same count `06_testing_debugging`'s `notifiesListenersOnEveryTransition` test checks in code. State the exact command you used.

## Part B — Add a real anomaly check

4. Right now, every transition logs at `INFO`, no matter how long the machine spent in the previous state. Modify the transition listener in `main()` so that if the machine spent *more* ticks in a state than expected — reuse the `TICKS_UNTIL_*` constants from `AutonomousStateMachine.java` as your "expected" values — it logs at `WARN` instead of `INFO`, with a message like `"transition took longer than expected"`. Since this demo's timings are fixed, temporarily change one `TICKS_UNTIL_*` constant in `AutonomousStateMachine.java` to actually trigger your new `WARN` path and confirm it fires, then revert it.

## Self-Check
- [ ] I answered all three Part A questions using search commands against `run.log`, not by reading the source
- [ ] I can state the exact command(s) I used for questions 2 and 3
- [ ] My Part B change logs a real `WARN` line when a state overruns its expected duration, and I confirmed it fires by temporarily forcing an overrun
- [ ] I reverted my temporary constant change afterward

## Reflection
Part A is the actual payoff `concept.md` promises, and it's easy to skip past when a demo prints only 14 lines: with a real match's log — thousands of lines, not 14 — finding one specific transition or confirming a count by eye stops being realistic, and searchable structure is the only thing that keeps it possible. Part B pushes past "logging records what happened" into "logging can flag what looks wrong, automatically, without a human staring at a dashboard live" — the same instinct behind why `08_error_handling_fault_tolerance` calls for `DriverStation.reportWarning` at the exact moment a fallback fires, not just a passive log line nobody reads until something has already gone wrong.
