# Exercise 1: Let the Compiler Guide You

## Goal
Add a field to `ScoutingEntry` and use the compiler's errors — not memory or careful reading — to find every place that needs to change.

## Scenario
Add a `climbed: boolean` field: whether the scouted robot climbed at the end of the match.

## Steps
1. In `scouting_app/src/types.ts`, add `climbed: boolean;` to the `ScoutingEntry` interface. Don't touch any other file yet.
2. Run `npx tsc --noEmit` from `scouting_app/`. Read the errors — there should be at least one.
3. Fix errors one at a time, re-running `npx tsc --noEmit` after each fix, until it prints nothing. Do not fix a file the compiler hasn't actually flagged.
4. You'll need a real checkbox in `index.html` for this to be genuinely settable — add one (`id="climbed"`, labeled), and read its `.checked` value in `validation.ts`.
5. In `render.ts`, show whether the team climbed on the rendered card.
6. `npm run build` should succeed with no errors, and the running app should let you check the box, submit, and see it reflected on the card.

## Self-Check
- [ ] I added the field to the interface first, before touching any other file
- [ ] Every fix I made was in response to an actual compiler error, not a guess about what "might" need updating
- [ ] `npx tsc --noEmit` prints nothing
- [ ] The checkbox's value actually makes it onto the rendered card

## Reflection
List every file the compiler eventually forced you to touch. Now imagine this same field addition in the plain-JavaScript version from `01_foundations` — nothing would have told you which files needed updating; you'd have needed to already remember, or find out by testing and noticing something was missing. What did the type system actually do for you here that testing alone wouldn't have caught until later?
