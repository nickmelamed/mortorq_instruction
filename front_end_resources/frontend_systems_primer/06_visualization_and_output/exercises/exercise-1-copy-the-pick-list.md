# Exercise 1: Copy the Pick List to Your Clipboard

## Goal
Give the pick list an actual way to leave the browser — the point of building it at all is reading it off during alliance selection, which nobody does by squinting at a laptop screen mid-selection.

## Steps
1. In `PickList.tsx`, add a function that formats the current `order` as plain text, one ranked line per team:
   ```text
   1. Team 1515
   2. Team 254
   3. Team 118
   ```
2. Add a `"Copy pick list"` button above the `<ol>` that calls [`navigator.clipboard.writeText(...)`](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText) with that formatted text.
3. Give the button its own tiny feedback state — a `copied` boolean is enough, no need for a full state machine here. On click, write to the clipboard, flip `copied` to `true`, and change the button's label to `"Copied!"` for about two seconds before reverting, the same `setTimeout`-driven reset `ScoutingForm`'s "Saved." message already uses.
4. Test it: reorder a couple of teams, click the button, and paste the result somewhere (a text editor, a chat box) to confirm the ranking and formatting are exactly right.
5. `npx tsc --noEmit` passes.

## Self-Check
- [ ] Clicking the button copies a correctly-ranked, correctly-formatted plain-text list
- [ ] The button gives visible feedback that the copy happened, not just silence
- [ ] The feedback reverts back to the normal label after a couple of seconds
- [ ] `npx tsc --noEmit` passes

## Reflection
`navigator.clipboard.writeText` returns a `Promise` and can reject (a browser can refuse clipboard access outside a real user gesture, or in certain iframe contexts). What did you actually do with that possibility in your implementation, and what would a scout mid-competition see if it silently failed?
