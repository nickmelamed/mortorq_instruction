# Exercise 3: Multi-Turn, on a Problem the Primer Didn't Cover

## Goal
Run your own multi-turn conversation using consistency lock-in, human-in-the-loop feedback, and edge-case testing.

## Scenario
You need a function that checks whether a robot mode transition is legal.

Modes: `Disabled`, `Autonomous`, `Teleop`, `Test`

Initial rules to give the model in Turn 1:
- Legal transitions: `Disabled -> Autonomous`, `Disabled -> Teleop`, `Disabled -> Test`, and any mode back to `Disabled`
- No direct transition between `Autonomous`, `Teleop`, and `Test` (must pass through `Disabled` first)
- An illegal transition should raise a `ValueError`

## Steps
1. **Turn 1:** Give the model the rules above and ask for a restated understanding plus a step-by-step approach (no code yet!).
2. **Turn 2:** Ask it to summarize the rules it's enforcing, to lock in consistency.
3. **Turn 3:** Now introduce **your own** additional rule that wasn't in the original spec (make one up - e.g. a confirmation flag required to enter `Test` mode). Ask the model to explain conceptually what needs to change before it touches any code.
4. **Turn 4:** Ask for the targeted code change for just that new rule.
5. **Turn 5:** Ask it to re-list every rule (original and new) and confirm the code enforces each one.
6. **Turn 6:** Give it a handful of edge cases (including one at the boundary of your new rule) and ask it to reason through pass/fail for each, without changing the code.

## Self-Check
- [ ] I used at least 4 distinct turns
- [ ] I introduced a rule of my own, not one copied from this file or `03-multi-turn.md`
- [ ] I confirmed in a later turn that the model actually kept enforcing my rule, not just acknowledged it once
- [ ] If the model contradicted itself between turns, I caught it

## Reflection
Did you notice the "Lost in the Middle" effect at any point? What did you do about it?
