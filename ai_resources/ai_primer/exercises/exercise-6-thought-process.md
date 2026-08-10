# Exercise 6: Should You Even Use AI Here?

## Goal
Every other exercise in this primer assumes you've already decided to prompt a model. This one practices the judgment call from "When Not to Reach for AI at All" in `06-thought-process.md`. Deciding whether a task is worth prompting for in the first place, not just how to prompt well once you've committed to it.

## Scenario
Below are six real situations you might hit while working on a robot codebase. For each one, decide: would you reach for AI, or just handle it yourself?

1. Renaming a single local variable for clarity in a function you just wrote.
2. Understanding why a brand-new WPILib API you've never used behaves unexpectedly, with no time pressure.
3. A mechanism stops responding, ten minutes before your next qualification match, in a pit with no usable wifi.
4. Writing the fix for this primer's own `exercise-1` clamp bug, which exists specifically to build your own debugging skill.
5. Generating a first-draft PID tuning helper script for a subsystem you're unfamiliar with, with plenty of time to review it before merging.
6. Fixing a one-line off-by-one error you've already spotted and already know the fix for.

## Steps
1. For each of the six, write one sentence: "Reach for AI" or "Handle it yourself," naming which specific criterion from `06-thought-process.md` applies - faster to write it yourself, the point is to learn the underlying skill, you can't verify the output, or a real-time competition constraint.
2. Pick the two you found hardest to decide on, and write down what made them ambiguous - was more than one criterion pulling in different directions?
3. For every task you marked "Reach for AI," write down what you would actually do to verify the output before trusting it (see "Verify, Don't Trust" in `06-thought-process.md`). "I'd check it" is not specific enough - say what you'd actually run or compare.

## Self-Check
- [ ] I gave a named reason for all six tasks, not just a yes/no
- [ ] At least one task I marked "handle it yourself" for a reason other than "I can write it faster"
- [ ] For every task marked "reach for AI," I named a concrete verification step
- [ ] I identified at least one task where two criteria pointed in different directions, and explained how I resolved it

## Reflection
Which criterion from `06-thought-process.md` do you expect to lean on most often on your own team's codebase? Look back at task 5 in particular; the "can't verify it" criterion depends on your own skill level, not just the task, so would your answer change a year from now as you get more experienced?
