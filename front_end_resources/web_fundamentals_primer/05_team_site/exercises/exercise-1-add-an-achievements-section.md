# Exercise 1: Add an Achievements Section

## Goal
Add a fifth section to the site, end to end — type, data, component, nav entry — without an example to copy line-by-line. This is the real test of whether `01`-`04` actually transferred.

## Scenario
Add an "Achievements" section listing awards and notable results the team has earned.

## Steps
1. In `types.ts`, add an `Achievement` interface (decide what fields belong — at minimum something like a title/award name, the year, and the event it was won at) and add `"achievements"` to the `SectionId` union.
2. In `data.ts`, add an `achievements: Achievement[]` array with a few real or placeholder entries, and add an entry to `navItems` for it.
3. Create `components/Achievements.tsx`, following the same shape as `Sponsors.tsx` or `Roster.tsx` — read from `data.ts`, map over the array, render something reasonable for each entry.
4. Register the new component in `App.tsx`'s `sections` map.
5. Run `npx tsc --noEmit`. If you added `"achievements"` to `SectionId` but forgot to add it to the `sections` map (or vice versa), the compiler should tell you — this is `02_why_typescript`'s "let the compiler guide you" exercise again, for real this time, with no one telling you which files to touch.
6. Confirm in the browser: a new nav button appears, it's clickable, it shows your achievements, and the tab title updates correctly when you click it.

## Self-Check
- [ ] `npx tsc --noEmit` passes with no errors
- [ ] Clicking "Achievements" in the nav shows the new section and highlights the nav button as active
- [ ] The browser tab title updates correctly when Achievements is active
- [ ] I didn't hardcode any achievement's text directly into `Achievements.tsx` — it all comes from `data.ts`

## Reflection
Did the compiler actually catch a mistake for you during this exercise, or did everything happen to work on the first try? Either way — what's the specific mistake `strict` mode was positioned to catch if you'd forgotten one of the five steps above?
