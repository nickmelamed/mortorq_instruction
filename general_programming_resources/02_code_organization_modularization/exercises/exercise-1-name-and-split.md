# Exercise 1: Name and Split

## Goal
Refactor a function that mixes several responsibilities under meaningless names into several functions, each with one clear job and a name that says what it does. Do this without changing what the program actually outputs.

## Scenario
`examples/messy_autonomous/` has the same routine in Java (`java/Auto.java`) and Python (`python/auto.py`): a single function, `doStuff()` / `do_stuff()`, that reads a sensor, decides an output value, drives a motor, and logs. They're all in one place, with variables named `x`, `y`, `flag2`, and `tmp`-style names throughout. Both versions are seeded (`Random(42)` / `random.seed(42)`), so their output is exactly reproducible from run to run.

## Steps
1. Pick Java, Python, or both. Run the messy version once and save its console output somewhere you can compare against later.
2. Identify the distinct responsibilities mixed into the one function. There are at least four: reading a sensor value, deciding an output value from it, driving a motor, and logging what happened.
3. Split the function into separate functions, one per responsibility, and give every function and variable a name that describes what it holds or does.
4. Re-run your refactored version and diff its output against what you saved in step 1. They should match exactly: same sensor values, same computed outputs, same motor commands, same hold-mode behavior, in the same order.

## Self-Check
- [ ] The function you started with is now split into at least four named pieces, each doing one job
- [ ] No variable or function in your final version has a meaningless name (`x`, `y`, `flag2`, `tmp`, `doStuff`, etc.)
- [ ] Output before and after refactoring is identical, run to run
- [ ] You can point to any one of your new functions and state its single responsibility in one sentence

## Reflection
Notice that the goal here wasn't to change what the program does. Every value computed, every motor command sent, is identical to before. All you changed was how the same behavior is organized and named.
