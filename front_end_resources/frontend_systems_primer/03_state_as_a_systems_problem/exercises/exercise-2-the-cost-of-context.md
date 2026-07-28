# Exercise 2: The Cost of Context (Break This on Purpose)

## Goal
See the real tradeoff Context makes, not just the convenience: every component reading a context re-renders whenever that context's value changes, whether or not the part it actually uses changed.

## Steps
1. Submit five or six entries first, so `EntryList` has several `EntryCard`s on screen at once.
2. In `EntryCard.tsx`, add `console.log("EntryCard render:", entry.teamNumber, entry.matchNumber);` as the first line inside the component function.
3. Open your browser console, then type a single character into the "Scouting as" field (`ScouterBadge`). Count how many `EntryCard render` lines just logged.
4. Before reading further: predict how many cards you expected to re-render, and why. Then compare that to what you actually saw.
5. Every `EntryCard` re-rendered, not just ones where `isMine` actually changed. Explain why, using what you know about how `useContext` subscribes a component to a context's value: does `ScouterIdentityContext` know or care that most cards' `isMine` result is unaffected by a single keystroke?

## Self-Check
- [ ] I logged and counted the actual re-renders, not just reasoned about them abstractly
- [ ] I can explain why *every* card re-rendered, not only the ones whose `(you)` badge changed
- [ ] I removed the `console.log` when done

## Stretch (optional)
Wrap `EntryCard`'s export in `React.memo(...)`. Re-run the same test — type into `ScouterBadge` again and watch the log. You should see every card still re-render anyway. That's not a mistake: `EntryCard` reads `scouterName` from context *directly*, so React correctly reruns it on every context change regardless of `memo` — `memo` only skips a re-render when a component's *props* haven't changed, and context reads aren't props. If you want to actually verify this, try memoizing a component that *doesn't* call `useScouterIdentity()` and confirm memo works as expected there instead.

## Reflection
This app has a handful of entries, so a handful of unnecessary re-renders costs nothing you'd notice. At what point — roughly how much data, how expensive a render — would this actually start to matter? What would you reach for first if it did: splitting `scouterName` into its own smaller context, moving the `isMine` comparison somewhere else, or something else entirely? You don't need to implement anything here — just reason through the tradeoff.
