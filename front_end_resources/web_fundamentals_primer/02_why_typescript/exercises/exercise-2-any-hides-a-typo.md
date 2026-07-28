# Exercise 2: `any` Hides a Typo (Break This on Purpose)

## Goal
See, concretely, what `any` actually costs you — not in the abstract, but as a bug you have to go find by hand instead of one the compiler hands you for free.

## Scenario
A teammate wants a quick debug helper that logs a summary of an entry before it's rendered. In a hurry, they typed the parameter as `any` instead of `ScoutingEntry` "to avoid import errors." Add this to `render.ts`, call it as the first line of `renderEntry`, and try it:

```ts
function logEntrySummary(entry: any) {
  console.log(`New entry: Team ${entry.teamNumber}, Match ${entry.mathNumber}`);
}
```

## Steps
1. Add the function above to `render.ts` and call `logEntrySummary(entry)` as the first line inside `renderEntry`.
2. Run `npx tsc --noEmit`. Notice it says nothing — no errors.
3. Run the app (`npm run dev`), submit an entry, and check the browser console. Read the logged line carefully.
4. Now change the parameter type from `entry: any` to `entry: ScoutingEntry` (you'll need to import the type) and run `npx tsc --noEmit` again.
5. Fix the error the compiler now gives you, and confirm the console output is correct.

## Self-Check
- [ ] I reproduced the wrong console output with `any` before fixing anything
- [ ] I can point to the exact typo'd property name
- [ ] Changing the parameter type from `any` to `ScoutingEntry` is what made the compiler catch it
- [ ] The fixed version logs the correct match number

## Reflection
`any` didn't cause the typo — the typo was always there. What did `any` actually do? Would `readAndValidateForm`'s discriminated union (`ValidationResult`) have been able to hide a mistake like this the same way, or does its shape make that specific kind of bug structurally harder to write in the first place?
