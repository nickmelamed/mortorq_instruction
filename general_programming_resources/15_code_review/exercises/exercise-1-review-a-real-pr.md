# Exercise 1: Review a Real PR

## Goal
Review `examples/review_this_pr/pr_diff.md` the way this module teaches — by tracing the actual logic against the PR's claimed fix, not by trusting the description and skimming the diff — then write real review comments, correctly labeled blocking vs. nitpick.

## Scenario
Treat this exactly like a PR waiting in your queue. You weren't in the room when it was written. All you have is the description and the diff.

## Steps
1. Before writing anything, trace `addSample()` by hand for the first three calls after a fresh `SensorSmoother` is constructed with `WINDOW_SIZE = 10`, called with values `40.0`, `42.0`, `41.0` in that order. What does each of the three calls return? (Remember: `samples` is a `double[]`, zero-initialized, and every slot — including ones no real reading has touched yet — gets summed and divided.)
2. Does bumping `WINDOW_SIZE` from `5` to `10` actually fix "noisy readings right after boot," the problem the PR claims to fix? Use your trace from step 1 to answer precisely — does the change make the described symptom better, worse, or unrelated to what's actually happening?
3. Write the blocking review comment you'd leave on this PR. Point at the specific behavior from your trace, don't just say something feels wrong, and phrase it as a question or observation the author can respond to — not a command.
4. Separately, find one **nitpick**-level issue with this PR — something worth a comment but not worth blocking the merge over — and write that comment too, clearly labeled as non-blocking.
5. In a sentence or two, describe what an actual fix would need to do differently. You don't need to write the code.

## Self-Check
- [ ] My trace from step 1 shows the average is dragged toward zero for early calls, regardless of `WINDOW_SIZE`
- [ ] My step 2 answer correctly identifies that the PR doesn't fix the root cause — it only changes how many ticks the symptom lasts for (worse, if anything: 10 affected ticks instead of 5)
- [ ] My blocking comment cites specific values or behavior from my trace, not a vague "this seems off"
- [ ] My nitpick comment is clearly labeled non-blocking and is a genuinely separate issue from the real bug
- [ ] My proposed fix addresses averaging only over samples actually collected so far, not just picking a different fixed window size

## Reflection
This PR is the exact shape of review failure this module exists to prevent: a description that sounds reasonable, a diff that looks like a plausible fix, and a reviewer who skims both and approves — because nothing about "changed 5 to 10" looks alarming on its own. The bug only shows up if you actually trace what the code does with real numbers, which is slower than skimming but is the entire point of review: catching the gap between what a change claims to do and what it actually does, before that gap costs a match instead of a PR comment.
