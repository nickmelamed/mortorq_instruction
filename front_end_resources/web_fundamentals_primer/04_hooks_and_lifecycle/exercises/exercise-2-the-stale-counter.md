# Exercise 2: The Stale Counter (Break This on Purpose)

## Goal
Reproduce a real stale closure, from a dependency array that's missing something it should have, and fix it by correcting the dependency array rather than by patching around the symptom.

## Scenario
Add this effect to `App.tsx`, inside the `App` function, near the existing `document.title` effect:

```tsx
useEffect(() => {
  const interval = setInterval(() => {
    console.log(`Entries so far: ${entries.length}`);
  }, 3000);
  return () => clearInterval(interval);
}, []); // <- look closely at this array once you've seen the bug
```

## Steps
1. Add the effect above, open your browser console, and let the app sit for 15-20 seconds without submitting anything. Confirm you see `Entries so far: 0` logged every 3 seconds.
2. Now submit two or three entries, spaced a few seconds apart, and keep watching the console. Note exactly what number keeps getting logged, even as the entry count on the page visibly climbs.
3. Before changing any code, write down (a comment, a scratch note, whatever) your explanation for why the console is stuck on that number specifically.
4. Fix it by correcting the dependency array — not by moving the `console.log` somewhere else, not by using a ref to dodge the problem. The effect should keep re-creating its interval whenever the count it depends on actually changes.
5. Confirm the fix: the logged number should now match the actual entry count shown on the page.

## Self-Check
- [ ] I observed the stuck-at-0 behavior before fixing anything
- [ ] My fix was a change to the dependency array, nothing else
- [ ] The logged count matches the real entry count after the fix
- [ ] I removed this exercise's effect from `App.tsx` once I was done (or left it, if you genuinely want a live entry counter logging — your call, just don't leave the broken version in)

## Reflection
The interval's callback function was created once, when the effect first ran, and captured `entries` as it existed *at that moment* — this is the same "captured a value, used it later, value had already changed" shape as `01_foundations/exercises/exercise-2-debug-the-delete-buttons.md`'s closure bug, and `03_react_core/exercises/exercise-2-the-vanishing-fields-bug.md`'s state-replacement bug. Three different bugs, three different causes, but all three come down to code running later than you assumed, against data that had already moved on. What's the one habit that would have caught this specific one *before* you ran the app at all? (Hint: an ESLint rule almost every real React project turns on exists specifically for this.)
