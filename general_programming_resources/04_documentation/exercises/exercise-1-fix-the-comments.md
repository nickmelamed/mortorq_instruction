# Exercise 1: Fix the Comments

## Goal
Remove comments that only restate code, and add the one comment that's actually missing and actually needed.

## Scenario
`examples/ShooterConfig.java` has a comment on every single method and field. None of them explain *why* anything is the way it is — they all just restate, in English, what the line directly below already says. Meanwhile, the one fact in this file that genuinely can't be inferred from the code — why `FLYWHEEL_RPM` is set to exactly `4500` — has no comment at all: it's `4500` because that's the minimum flywheel speed that reliably clears the low goal from anywhere in the shooting zone, based on week 3 testing. Going lower undershoots long shots; going higher shreds the ball at close range.

## Steps
1. Read every comment in `ShooterConfig.java` and, for each one, decide: does this explain *why* something is true, or does it just restate *what* the line below it already says in plain English?
2. Delete every comment that only restates the code below it. If you're unsure, try covering the comment and reading just the code — if the code alone already told you the same thing, the comment wasn't adding anything.
3. Add a comment on `FLYWHEEL_RPM` that captures the *why* described in the scenario above — the testing result, and what happens if the value drifts too far in either direction.
4. Reread the file with your changes. Every remaining comment should tell you something the code by itself couldn't.

## Self-Check
- [ ] No comment in the file simply restates the line of code below it
- [ ] `FLYWHEEL_RPM` has a comment explaining why it's `4500`, specifically, and not some other number
- [ ] I can point to every remaining comment and explain what it tells the reader that good naming alone wouldn't

## Reflection
Notice the file reads exactly as clearly with three fewer comments than it started with — the method and variable names were already doing the job the deleted comments were redundantly repeating. The one comment you *added* is the only one doing real work, because it's the only one carrying information the code genuinely can't express on its own: a fact from outside the code (a season of testing) rather than a restatement of what's already inside it.
