# Exercise 2: Audit an Existing Decision Against Your Needs Statement

## Goal
Check whether a design decision that already shipped actually serves a real need, or just happens to look reasonable.

## Scenario
`frontend_systems_primer/04_ui_ux_principles` replaced `scouting_app`'s alliance `<select>` with a two-button toggle, justified by a constraint (30-90 seconds per entry) that was simply stated, not derived. You now have a needs statement of your own from Exercise 1.

## Steps
1. Take your pit-scout (or equivalent) needs statement from Exercise 1.
2. Look at the current alliance toggle in `scouting_app` — read `concept.md`'s excerpt or run the app and use it yourself.
3. Ask, in writing: does this specific decision serve the specific need in your statement? Not "is it good UX" in general — does *this* choice reduce the time or error your statement describes.
4. Find one more existing decision in `scouting_app` or `team_site` (your choice) and repeat the check.
5. For any decision that doesn't clearly serve your stated need, write one sentence on what you'd change and why — you don't need to implement it, just state it.

## Self-Check
- [ ] I checked the alliance toggle against my own written need, not against a general "is this good design" impression
- [ ] I audited a second, different decision beyond the alliance toggle
- [ ] For anything that didn't pass, I wrote a concrete one-sentence alternative, not just "this is bad"

## Reflection
Design decisions that "feel right" and design decisions that actually serve a stated need can look identical from the outside. What's the cheapest habit you could adopt — before shipping any UI decision — that would force the comparison in this exercise to happen by default instead of after the fact?
