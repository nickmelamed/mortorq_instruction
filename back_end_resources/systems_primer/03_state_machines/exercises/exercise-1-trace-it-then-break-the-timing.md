# Exercise 1: Trace It, Then Break the Timing

## Goal
Hand-trace `AutonomousStateMachine.java`'s state at every tick before running it, then predict how changing one constant reshapes the whole routine's timeline — without changing any of the *relative* per-state durations.

## Setup
Work in `03_state_machines/java/AutonomousStateMachine.java`. Compile/run with:
```text
$ javac AutonomousStateMachine.java
$ java AutonomousStateMachine
```

## Steps
1. Using only the three `TICKS_UNTIL_*` constants at the top of the file (not running anything yet), fill out a table: for ticks 1 through 14, which state is the machine in, and on which exact tick does each transition (`INTAKE`→`TRANSPORT`, `TRANSPORT`→`SCORE`, `SCORE`→`IDLE`) fire?
2. Run the file and check your table against the real `>> transition:` lines it prints.
3. Now change `TICKS_UNTIL_PIECE_DETECTED` from `4` to `7` (simulating a piece that's harder for the intake sensor to detect), and predict, before running: on which tick will the machine now reach `IDLE`? Will `TRANSPORT`'s and `SCORE`'s own *durations* (5 ticks and 3 ticks, respectively) change at all, or just when they start and end in absolute tick numbers?
4. Run it and check.

## Self-Check
- [ ] My original 14-tick trace matched the real transition ticks exactly
- [ ] I correctly predicted the new tick number for reaching `IDLE` after changing `TICKS_UNTIL_PIECE_DETECTED` to `7`
- [ ] I can explain, using `transitionTo()`'s `ticksInState = 0` line, why `TRANSPORT` and `SCORE` each still take exactly as many ticks as before, even though the whole routine now finishes later

## Reflection
Every state's duration in this machine is measured **relative to when it started** (`ticksInState`, reset to `0` on every transition), not against some fixed absolute schedule. That's exactly why lengthening `INTAKE` shifts everything after it later by the same amount, without needing to touch `TRANSPORT` or `SCORE`'s own logic at all — the kind of design that keeps a change in one state from cascading into edits everywhere else. It's also exactly the property a real autonomous routine wants: if a real intake sensor takes a little longer to fire on a given match (a dirtier field, a piece at a slightly different angle), the rest of the sequence should still behave identically once it actually starts, not silently assume the old timing.
