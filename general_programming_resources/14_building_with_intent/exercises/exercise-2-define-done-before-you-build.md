# Exercise 2: Define Done Before You Build

## Goal
Practice naming a feature's real end users and writing a checkable, non-vanity goal metric — entirely before writing any code.

## Scenario
A teammate hands you this feature request, exactly as written: "make the scouting app better for match day." That's the whole ask. No editor needed for this exercise.

## Steps
1. **Name every concrete end user of this feature**, not just "scouts." Think about who's actually touching the app or depending on its output on match day, and include at least one entry for a future maintainer — someone who'll read or extend this code next season.
2. For each end user you named, write one sentence on the one thing that actually matters to *them* specifically (a scout's need is not the same as a future maintainer's need, even though both are "end users" of the same feature).
3. **Write one checkable goal metric** for this feature — a statement with both a number and a condition you could actually verify, per `concept.md`'s "define your goal metric" section. Not "the app is faster" — something you could check against a stopwatch or a log.
4. **Write one plausible vanity-metric version** of the same underlying goal, and explain in one sentence why it's gameable — why a team could satisfy that number without actually solving the real problem.
5. Pick one end user from step 1 whose need your goal metric from step 3 does *not* actually cover, and say so honestly, in one sentence.

## Self-Check
- [ ] My end-user list has at least three distinct people/roles, including a future-maintainer entry
- [ ] Each end user has a one-sentence need that's actually different from the others, not a restatement
- [ ] My goal metric has both a number and a condition that could be checked against something real
- [ ] My vanity-metric example is genuinely gameable, and I can say why in one sentence
- [ ] I honestly named at least one end user my goal metric doesn't cover

## Reflection
"Make the scouting app better for match day" sounds like a small ask, and it's tempting to just start building something and call it done once it feels finished. The five steps above are what `concept.md` means by defining what you're building, for whom, and to what bar, *before* you build it — every one of them was answerable without touching a single line of code, and every one of them changes what the actual feature should look like once you do start. Step 5 is worth sitting with in particular: no single goal metric covers every end user's real need, and admitting that up front is more useful than discovering it after the feature ships and someone asks why it doesn't do the one thing they actually needed.
