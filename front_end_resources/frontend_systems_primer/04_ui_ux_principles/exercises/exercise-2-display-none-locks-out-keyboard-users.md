# Exercise 2: `display: none` Locks Out Keyboard Users (Break This on Purpose)

## Goal
Feel the difference between "visually hidden" and "hidden from everyone," instead of just reading that they're different.

## Steps
1. Fill out and submit an entry using **only your keyboard** — no mouse, no trackpad, no touchscreen. `Tab` to move between fields, arrow keys to pick an alliance once you're inside that radiogroup, `Space` to check a radio, `Enter` or `Tab`-to-the-button-then-`Enter`/`Space` to submit. Confirm you can complete a whole entry this way before changing anything — this is the baseline you're about to break.
2. In `style.css`, find `.visually-hidden` and temporarily change `position: absolute` to `display: none` (leave everything else in that rule alone).
3. Refresh the page and repeat step 1: try to fill out and submit an entry using only your keyboard.
4. Describe exactly what breaks. Where does `Tab` take you now when you reach the alliance field? Can you select red or blue at all without touching the mouse?
5. Revert your change and confirm keyboard-only entry works again.

## Self-Check
- [ ] I completed a full keyboard-only submission *before* breaking anything, so I have something to compare against
- [ ] I can state precisely what `Tab` does differently once the radios are `display: none`
- [ ] I reverted the change and re-confirmed keyboard access is restored

## Reflection
Visually, `display: none` and the visually-hidden pattern look identical — both make the element invisible on screen. Nothing about glancing at the page would tell you which one a given element is using. What does that tell you about why this specific category of bug is easy to introduce by accident and easy to miss in a normal visual review, and what would you actually have to do to catch it (besides "remember to test with a keyboard")?
