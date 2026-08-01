# Exercise 1: Predict the Blast Radius

## Goal
Predict, before running any code, exactly which ticks in `BlockingCallBug.java` will show an `OVERRUN` — then verify, then break your own model by adding a second blocking tick.

## Setup
Work in `01_concurrency_realtime_loops/java/BlockingCallBug.java`. Compile/run with:
```text
$ javac BlockingCallBug.java
$ java BlockingCallBug
```

## Steps
1. Before running anything, read the file and answer, in writing: which tick(s) will print `OVERRUN`, and why exactly that one and not, say, tick 9 or tick 7? Write your prediction down before you run it — the point is catching what your mental model gets wrong, not getting it right on the first try.
2. Run it and check your prediction against the real output.
3. Now look closely at tick 9's printed line. `BLOCKING_TICK` stalls for 300ms — fifteen times the 20ms budget — but does tick 9 show any sign of that stall at all? Explain, in one sentence, why or why not, using specifically how `tickStart` is computed inside the loop.
4. Modify the file so **two** ticks block instead of one (e.g. ticks 5 and 11), each for a different duration of your choosing. Predict what the output will look like before running, then verify.
5. Now modify it so two blocking ticks happen **back to back** (e.g. ticks 5 and 6) instead of spaced apart. Does anything about the *shape* of the output change compared to your step 4 version?

## Self-Check
- [ ] I predicted the overrun tick(s) correctly before running the unmodified file, or I can explain exactly what I got wrong
- [ ] I can explain, using the loop's actual timing code, why a 300ms stall on tick 8 doesn't slow down tick 9
- [ ] My two-blocking-tick version compiles, runs, and produces two separate `OVERRUN` lines
- [ ] I can state whether back-to-back blocking ticks behave differently from spaced-apart ones, and why (or why not)

## Reflection
This demo's loop restarts its timing budget fresh every tick (`tickStart = System.nanoTime()` at the top of each iteration) — so a stall doesn't accumulate; it costs you exactly that tick's overrun and nothing more. Real WPILib is close to this, but not identical: a bad-enough or frequent-enough pattern of overruns is exactly what makes `Watchdog` start reporting real match-time problems, and back-to-back overruns are a much stronger signal that something is systematically wrong (a loop that's too slow every cycle) than a one-off hiccup (a single slow network call). Knowing the difference is why "we had one overrun" and "we have overruns every match" get treated very differently by a team debugging a real robot.
