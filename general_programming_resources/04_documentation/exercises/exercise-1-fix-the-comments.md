# Exercise 1: Fix the Comments

## Goal
Remove comments that only restate code, and add the one comment that's actually missing and actually needed.

## Scenario
`examples/ShooterConfig.java` has a comment on every single method and field. None of them explain *why* anything is the way it is. They all just restate, in English, what the line directly below already says. Meanwhile, the one fact in this file that genuinely can't be inferred from the code — why `FLYWHEEL_RPM` is set to exactly `4500` — has no comment at all. It's `4500` because that's the minimum flywheel speed that reliably clears the low goal from anywhere in the shooting zone, based on week 3 testing. Going lower undershoots long shots; going higher shreds the ball at close range.

## Steps
1. Read every comment in `ShooterConfig.java` and, for each one, decide: does this explain *why* something is true, or does it just restate *what* the line below it already says in plain English?
   
2. Delete every comment that only restates the code below it. If you're unsure, try covering the comment and reading just the code. If the code alone already told you the same thing, the comment wasn't adding anything.
   
3. Add a comment on `FLYWHEEL_RPM` that captures the *why* described in the scenario above. This should be the testing result, and what happens if the value drifts too far in either direction.
   
4. Reread the file with your changes. Every remaining comment should tell you something the code by itself couldn't.
   
5. Separately from the why-comment above, write a real docstring (Javadoc, since this file is Java) for `computeSpinUpTime`, following `concept.md`'s "Writing: docstrings and comments" section: document its parameter, its return value, and one condition that matters: what actually happens if `accelerationRpmPerSecond` is `0`. Don't guess, you must check it yourself before you document it.

## Self-Check
- [ ] No comment in the file simply restates the line of code below it
- [ ] `FLYWHEEL_RPM` has a comment explaining why it's `4500`, specifically, and not some other number
- [ ] I can point to every remaining comment and explain what it tells the reader that good naming alone wouldn't
- [ ] `computeSpinUpTime` has a real Javadoc documenting its parameter, its return value, and what happens when `accelerationRpmPerSecond` is `0`. I confirmed that behavior myself rather than assuming it

## Reflection
Notice the file reads exactly as clearly with three fewer comments than it started with. The method and variable names were already doing the job the deleted comments were redundantly repeating. The one comment you *added* is the only one doing real work, because it's the only one carrying information the code genuinely can't express on its own. It's a fact from outside the code (a season of testing) rather than a restatement of what's already inside it. The docstring from step 5 is doing a related but different job: it's not explaining an outside reason the way the `FLYWHEEL_RPM` comment is, it's documenting a promise — what a caller can rely on `computeSpinUpTime` to do, edge case included, without having to read its body first.
