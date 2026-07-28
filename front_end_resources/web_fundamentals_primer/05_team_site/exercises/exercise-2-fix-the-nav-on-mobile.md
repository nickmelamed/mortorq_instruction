# Exercise 2: Fix the Nav on Mobile (Break This on Purpose)

## Goal
Find a real, ship-blocking layout bug using your browser's device tools, then fix it with the box model and flexbox knowledge from `01_foundations` — nothing here needs new CSS you haven't already learned.

## Steps
1. Open `team_site` in your browser with `npm run dev`, then open dev tools and switch to a narrow device width (an iPhone SE at 375px is a good stress test — most browsers' dev tools have a device toolbar/responsive mode for this).
2. Look at the nav bar specifically. Something is wrong with it at this width — describe exactly what you see before changing anything.
3. Open `index.css` and find the `nav ul` rule. Explain, in your own words, why `display: flex` alone doesn't prevent what you just saw — what does `flex-wrap`'s default value actually do?
4. Fix it. You have real design freedom here: wrapping the nav items onto a second line, shrinking the button padding at narrow widths with a media query, or something else you come up with are all legitimate — just make sure every nav button stays fully visible, tappable, and legible at 375px wide.
5. Re-test at 375px, then also check it still looks right back at a normal desktop width — a fix that only works narrow and breaks wide isn't done.

## Self-Check
- [ ] I can describe the original bug precisely (not just "it looked bad")
- [ ] All four nav buttons are fully visible and tappable at 375px after my fix
- [ ] The nav still looks correct at a normal desktop width
- [ ] My fix uses concepts from `01_foundations` (box model, flexbox, and/or a media query) — no new CSS framework or library

## Reflection
This bug never showed up once while you were building and testing at normal desktop width. What does that tell you about the habit of only ever testing a layout at the one window size your laptop happens to be open to?
