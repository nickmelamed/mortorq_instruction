# Exercise 1: Pair on Inherited Code, Then Fix a Backlog

## Goal
Answer `10_reading_unfamiliar_code`'s own orientation questions again — but as a driver/navigator pair instead of solo — and see what pairing actually changes about what you find. Then practice turning a vague backlog into real, workable Kanban cards.

## Part A — Pairing on `inherited_robot_code`

Find a partner. Open `10_reading_unfamiliar_code/examples/inherited_robot_code/` and `10_reading_unfamiliar_code/exercises/exercise-1-orient-in-the-codebase.md` side by side.

1. Decide who drives first (types, navigates the files directly) and who navigates (no keyboard — reads ahead, asks questions, tracks the big picture). Set a timer for 15 minutes.
2. Work through `10`'s exercise questions together under this split. When the timer goes off, swap roles and continue from wherever you are.
3. Finish all of `10`'s exercise questions this way, swapping roles at least twice total.
4. Once you're done, both partners answer separately, in writing, before comparing: did pairing change what you found, or how confident you are in the answers, compared to doing this alone? Be specific — a question you'd have answered differently, or gotten wrong, working solo.

## Part B — Fixing a vague backlog

Below is a real-shaped backlog someone wrote in a rush before a meeting:

```text
- fix vision
- climber is broken
- make the drivetrain code better
- scouting app needs work
- talk to mechanical about the intake
```

5. Pick any two items above and rewrite each as a real Kanban card: a specific, scoped, done-able task with a clear "done" condition — not a restatement of the vague version with different words. (For example, "fix vision" might become several genuinely different cards depending on what's actually wrong — you'll need to invent a plausible specific problem, since the original doesn't say one.)
6. For one of your two rewritten cards, write what "Done" means for it, using this module's definition-of-done section — not just "it works," but tested-and-reviewed the way `15_code_review` and `git_resources/CONTRIBUTING.md` require.

## Self-Check
- [ ] Both partners drove and navigated at least once each in Part A
- [ ] Both partners' written comparisons in step 4 are specific (a real question or answer that changed), not just "it was fine"
- [ ] My two rewritten cards in Part B are specific and scoped enough that someone could pick one up and know exactly when it's finished
- [ ] My "Done" definition in step 6 requires more than "it ran once and looked right"

## Reflection
"Fix vision" and "climber is broken" aren't tasks — they're symptoms with no scope, no owner, and no way to know when they're finished, which is exactly why a backlog full of items like that stalls even when everyone's genuinely working. A Kanban board full of vague cards gives the illusion of visibility (there's a board! there are cards!) without the substance of it, because nobody looking at "fix vision" can tell whether that's an hour of work or a week's. The pairing half of this exercise usually surfaces the same lesson from a different angle: a navigator who has to ask "wait, what does this do?" out loud is often catching the exact ambiguity that would otherwise have gone unnoticed working alone.
