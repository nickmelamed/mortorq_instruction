# Exercise 2: Receive the Review

## Goal
Practice the other half of this module; not writing review comments, but responding to them well, on both the ones you should fix and the one you might genuinely disagree with.

## Scenario
You're the author of `examples/review_this_pr/pr_diff.md`'s `SensorSmoother` PR now, not the reviewer. Three comments came back on it:

> **Comment 1 (blocking):** This doesn't fix the root cause. `samples` starts as `double[WINDOW_SIZE]`, all zeros, and `addSample` always divides by the full `WINDOW_SIZE` even before the buffer has actually filled up — so early readings get dragged toward zero no matter how big the window is. Increasing `WINDOW_SIZE` from 5 to 10 just means more ticks are affected, not fewer.

> **Comment 2 (nitpick):** `count` is a pretty generic name for the only counter this class has. Something like `totalSamplesSeen` would make it clearer at a glance.

> **Comment 3 (nitpick):** Any reason this isn't using a `Queue`/`Deque` instead of a raw array with modulo indexing? Feels more idiomatic.

## Steps
1. **Respond to Comment 1 for real.** Fix `addSample` so it averages only over samples actually collected so far. This should be before the buffer fills, divide by how many real readings exist, not by `WINDOW_SIZE`. Confirm your fix by hand-tracing the same three calls from `exercise-1` (`40.0`, `42.0`, `41.0` into a freshly-constructed `WINDOW_SIZE = 10` smoother) and checking the results look like real running averages, not values dragged toward zero. Then write the reply you'd actually post.
   
2. **Respond to Comment 2.** This one's a straightforward improvement with no real cost to taking it. Rename the field, and write the one-word-plus reply per `concept.md`'s "respond to every comment" habit.
   
3. **Respond to Comment 3 — and this time, disagree.** A raw array with modulo indexing is a deliberate choice here, not an oversight: this class runs inside a robot's periodic loop, where avoiding unnecessary allocation and autoboxing (a `Deque<Double>` boxes every primitive `double`) actually matters, the same budget-consciousness `13_designing_under_constraints` teaches. Write a reply that explains this reasoning. Be respectful, specific, and actually engaging with why the suggestion doesn't win here, not "no" and not silently doing it anyway to avoid a disagreement.

## Self-Check
- [ ] My fix to Comment 1 correctly averages over only the samples collected so far, verified against the same three-call trace `exercise-1` used
- [ ] I responded to all three comments — none were left silently unaddressed, per `concept.md`'s "respond to every comment" habit
- [ ] My Comment 2 reply is brief, since the nitpick didn't need an argument, just an acknowledgment
- [ ] My Comment 3 reply gives a real, specific technical reason (allocation/autoboxing cost in a periodic loop), not a vague "I prefer it this way"
- [ ] I can state, in one sentence, why Comment 3 deserved a counter-argument instead of either silent compliance or being ignored

## Reflection
Comments 1 and 2 are easy in a way Comment 3 isn't: one was clearly right, one cost nothing to accept. Comment 3 is the actual test, because the instinct under review pressure is to either cave and add the `Deque` just to make the comment go away, or to leave it unanswered and hope the reviewer doesn't push. Both are worse than the third option: saying, specifically, why the code stays as it is. `concept.md` frames this as a habit for the author, but notice what it does for the reviewer too; a reviewer who never hears a real counter-argument has no way to find out when *they're* the one who's missed something.
