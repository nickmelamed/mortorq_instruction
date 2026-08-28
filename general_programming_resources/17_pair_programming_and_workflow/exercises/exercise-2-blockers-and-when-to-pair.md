# Exercise 2: Blockers and When to Pair

## Goal
Practice two judgment calls `exercise-1` doesn't cover: telling a real blocker apart from status theater, and deciding whether a situation actually calls for two people instead of one.

## Part A — Real Blocker or Status Theater?

Below are five lines from a fictional team's standup. For each one, decide: is this a **real blocker** (something specific enough that it should change what someone else does today), **status theater** (framed like an issue, but too vague for anyone to act on), or **just a status update with nothing blocking** (which is completely fine, and doesn't need fixing).

```text
1. "Blocked: nobody's confirmed which port the new motor controller goes into
    on the intake — I don't want to guess and fry it."
2. "Auto's still not working right. Going to keep debugging it today."
3. "Can't merge my PR — nobody's reviewed it since yesterday."
4. "Climber's being finicky. I'll poke at it more this afternoon."
5. "No blockers — scouting app's going fine, added the match-schedule screen
    yesterday."
```

1. Classify all five, per `concept.md`'s test: does the answer to "what's blocking me" change what anyone else actually does today?
   
2. For each one you classified as status theater, rewrite it two ways: once cutting it entirely (if there's genuinely nothing to say), and once turning it into a real blocker by inventing the specific, missing information a real one would have had.
   
3. Explain, in one sentence, why line 5 isn't status theater even though it's short and nothing is wrong.

## Part B — Pair, or Don't?

For each situation, decide whether it's worth pairing on, per `concept.md`'s worth-it/not-worth-it list, and justify your answer in one sentence:

```text
1. A test keeps failing intermittently, and nobody can explain why even
   after an hour of staring at it alone.
2. A new member joined this week and needs to touch the vision-processing
   code for the first time.
3. You need to update the scouting app's color scheme to match new team
   branding.
4. You're about to merge a change to the autonomous-period code, two days
   before competition.
5. You need to rename a variable for clarity across a few files — a
   mechanical, well-understood change.
```

4. For the two you'd pair on, name which specific risk pairing actually reduces (an unreproducible bug, a knowledge gap, a costly mistake), not just "it's safer in general."
   
5. For the two you wouldn't, state what pairing would have cost here that it wouldn't have bought back.

## Self-Check
- [ ] I correctly separated the two real blockers, the two status-theater lines, and the one honest "nothing blocking" line in Part A
- [ ] My rewritten status-theater lines are genuinely different from each other, not the same invented blocker copy-pasted twice
- [ ] I can state why line 5 doesn't need fixing, in one sentence
- [ ] I correctly identified situations 1, 2, and 4 as worth pairing on, and 3 and 5 as not, with a real reason for each — not just "yes" or "no"

## Reflection
Part A and Part B are the same skill from two different angles. Both are about noticing when something *sounds* like it matters (a blocker mention, a "let's be careful" instinct) without actually being specific enough to justify the response it's dressed up as. A vague blocker wastes a standup the same way pairing on routine work wastes a person.
