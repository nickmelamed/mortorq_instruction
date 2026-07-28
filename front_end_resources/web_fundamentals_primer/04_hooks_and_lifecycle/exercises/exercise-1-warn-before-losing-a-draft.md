# Exercise 1: Warn Before Losing a Draft

## Goal
Write your own acquire-in-effect / release-in-cleanup pair, for a real problem: a scout who's halfway through typing notes and accidentally closes the tab loses everything they typed.

## Steps
1. In `ScoutingForm.tsx`, add a `useEffect` that listens for the browser's `beforeunload` event on `window`.
2. Inside the handler, only actually warn if there's something worth saving — check whether `draft` differs from `emptyDraft` in some field (you decide exactly what counts as "there's a real draft"; matching every field exactly is one valid approach, checking just a couple of the more important fields is also fine, as long as you can justify the choice).
3. Call `event.preventDefault()` when warning is warranted — that's what triggers the browser's native "leave site? changes may not be saved" confirmation.
4. Add the matching cleanup: remove the listener when the effect re-runs or the component unmounts, the same way the existing keyboard-shortcut effect does.
5. Test it: type something into a field, then try to close or refresh the tab, and confirm the browser prompts you. Then submit the form (clearing the draft) and confirm closing the tab no longer prompts you.

## Self-Check
- [ ] The browser's confirmation prompt appears when there's unsaved input and you try to leave
- [ ] It does *not* appear right after a successful submit, once the draft is back to empty
- [ ] The effect has a cleanup function that removes the listener
- [ ] This effect's dependency array is correct for what it actually reads (think about whether `draft` needs to be in it)

## Reflection
This effect reads `draft` inside its handler. What would go wrong if you left the dependency array empty (`[]`) instead of including whatever `draft` requires? Try it both ways and describe the difference you actually observe, not just what you'd predict.
