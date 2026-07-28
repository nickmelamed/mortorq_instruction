# Exercise 2: The Vanishing Fields Bug (Break This on Purpose)

## Goal
See exactly what `useState` does and doesn't do for you automatically, by breaking the one assumption people coming from other frameworks tend to make about it.

## Scenario
A teammate wants to "simplify" `updateField` in `ScoutingForm.tsx`. Replace the real implementation with theirs:

```tsx
function updateField<K extends keyof ScoutingEntry>(field: K, value: ScoutingEntry[K]) {
  setDraft({ [field]: value } as ScoutingEntry);
}
```

## Steps
1. Make that swap in `ScoutingForm.tsx` (temporarily — you'll revert it).
2. Run the app. Type a team number. Then click into the match number field and type something there.
3. Look back at the team number field. Something's wrong with it — describe exactly what happened, in your own words, before reading any further.
4. Revert to the original implementation (`setDraft((prev) => ({ ...prev, [field]: value }))`) and confirm the bug is gone: every field should keep its value no matter which other field you're currently typing into.

## Self-Check
- [ ] I reproduced the vanishing-field bug before fixing anything
- [ ] I can explain, without looking it up, exactly what `{ [field]: value }` builds and hands to `setDraft`
- [ ] I can explain why `{ ...prev, [field]: value }` doesn't have the same problem
- [ ] All fields persist correctly after reverting

## Reflection
`setDraft` doesn't merge whatever you pass it into the existing state — it *replaces* the state with exactly what you give it. Some other UI frameworks and older React class components did auto-merge object state updates. Given what you just watched happen, why might React's actual designers have decided *not* to build automatic merging into `useState`? (Hint: think about what "merge" would even mean for a piece of state that isn't an object — a number, a string, an array of entries.)
