# Exercise 2: Find Existing Drift in `scouting_app`

## Goal
Find real, already-existing places in the codebase where a missing design system let the same value drift into multiple hardcoded copies.

## Steps
1. Open `scouting_app`'s actual `style.css` (and any component-level styles) and search for a value you'd expect to be shared — a color used for the alliance toggle, the 44px touch-target minimum, a spacing number that shows up in more than one rule.
2. Find at least two places where the same conceptual value (e.g. "a comfortable touch target," "the alliance red") is written as a separate hardcoded number or hex code instead of a shared value.
3. For each one you find, write down: what token from Exercise 1 (or a new one) would replace it, and whether the two hardcoded copies you found actually agree with each other exactly, or have quietly drifted (e.g. 44px in one place, 42px in another).
4. You don't need to edit the code — the deliverable is the list of drift sites and the token that would have prevented each one.

## Self-Check
- [ ] I searched actual `scouting_app` source files, not just skimmed from memory
- [ ] I found at least two real instances of a repeated value written as separate hardcoded copies
- [ ] For at least one instance, I checked whether the copies actually still match each other or have drifted
- [ ] For each instance, I named the specific token that would fix it

## Reflection
`frontend_systems_primer/04_ui_ux_principles`'s own exercises found exactly this kind of drift in `TeamLookup.tsx`. Did the drift you found here get caught by anyone before now, and what does that suggest about how much you can rely on someone "just noticing" versus building a system that prevents it structurally?
