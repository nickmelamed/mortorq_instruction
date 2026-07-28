# Exercise 2: The Silent Empty State (Break This on Purpose)

## Goal
See exactly what "success" without an empty check looks like to a real user — nothing, with zero explanation — and understand why that's a genuine bug, not a minor polish issue.

## Steps
1. In `TeamLookup.tsx`, comment out (don't delete — you're putting it back) the block that renders when `status.status === "success" && status.data.length === 0`.
2. Run the app, paste just a header row into the CSV box — `team_number,nickname` and nothing else — and click "Import CSV."
3. Look at the screen. Nothing changed: no team dropdown (correctly, there's nothing to select), but also no error, no message, nothing telling you the import "succeeded" with zero results. Compare this to what happens right now if you click "Import CSV" with the text box completely empty, before pasting anything at all (the `idle` state) — can you, as someone who didn't write this code, tell those two situations apart on screen?
4. Restore the empty-check block.
5. Now break it the other way: temporarily change the empty check's condition from `status.data.length === 0` to `status.data.length === 1` and paste a CSV with exactly one real team in it. Confirm you get the "no teams found" message even though a team genuinely loaded. Then fix the condition back.

## Self-Check
- [ ] I reproduced a "successful" import that displayed nothing, with no explanation
- [ ] I can articulate, in one sentence, why that's a real bug and not just a missing nice-to-have
- [ ] I reproduced the opposite mistake (a real result incorrectly treated as empty)
- [ ] The empty-check block is restored to its correct condition afterward

## Reflection
`concept.md` calls "success with zero results" a state that's distinct from loading and error. After actually seeing the silent-nothing bug above, restate in your own words why collapsing "empty" into "success" (instead of giving it its own visible message) is a mistake specifically for a *user-facing* screen, in a way it might not be for a backend function that just returns an empty list to another piece of code.
