# Exercise 2: Pick the First Task

## Goal
Practice the Small/Safe/Owned/Real framework from `concept.md`'s "Structuring a First Task" section against real-shaped candidates, not just recognizing the four words.

## Scenario
Below are five candidate "first real tasks" a mentor is considering handing to a new team member. Some are genuinely good fits; some clearly aren't, each for a different reason.

```text
1. Add a new sensor reading to the dashboard telemetry — the sensor is
   already wired and reading correctly, it just needs to show up in the
   existing telemetry table.
2. Rewrite the entire autonomous routine from scratch, since the current
   one is messy.
3. Here's a vision-pipeline bug nobody's found in two weeks — see if you
   can figure it out on your own.
4. Add one unit test for an existing, already-working function in the
   drivetrain code, then get it reviewed and merged like any other change.
5. Reconfigure the robot's network settings for the competition venue,
   the night before the first match.
```

## Steps
1. For each candidate, decide: is this a good first task? If not, name the *specific* letter of Small/Safe/Owned/Real it fails — not just "this seems risky."
2. For each one you rejected, rewrite it into something that keeps the same underlying idea (fixing the messy auto routine, finding the vision bug, touching the network config) but actually fits all four criteria. You're allowed to change scope, timing, or how much help is built in — you're not allowed to just pick an unrelated, easier task instead.
3. For the two you accepted, explain in one sentence each why they still count as **Real** — what makes them an actual shipped contribution instead of a practice exercise that gets thrown away.

## Self-Check
- [ ] I correctly identified candidates 1 and 4 as good fits, and 2, 3, and 5 as not
- [ ] Each rejected candidate is tied to a specific failed criterion (Small, Safe, or Owned), not a generic "too risky"
- [ ] My three rewrites keep the same underlying task, scoped or resequenced to actually fit all four criteria — not swapped out for something unrelated
- [ ] I can state why candidates 1 and 4 are genuine contributions, not throwaway practice

## Reflection
Notice that candidates 2, 3, and 5 each fail in different ways. The framework isn't a single test a task passes or fails as a whole, it's a combination that you need to address to have useful task creation skills. 
