# Exercise 1: Audit `TeamLookup`

## Goal
Apply this topic's touch-target rule somewhere it wasn't already applied for you, and notice that "looks fine on a laptop trackpad" and "actually usable on a tablet" are different bars.

## Scenario
`concept.md`'s CSS changes only touched `.field input`/`.field select`/`.field textarea` and the base `button` rule. `TeamLookup.tsx`'s event-key input, CSV textarea, and "Load from TBA"/"Import CSV" buttons use their own separate CSS classes (`.team-lookup-source input`, `.team-lookup-source button`) that were never touched — and it shows, if you actually measure them.

## Steps
1. Open the app, open your browser's dev tools, and use the element inspector to check the actual rendered height of the "TBA event key" input and the "Load from TBA" button. Write down the numbers.
2. Compare those numbers to the 44px minimum this topic's `concept.md` argued for. Confirm they fall short.
3. Fix `.team-lookup-source input`, `.team-lookup-source textarea`, and `.team-lookup-source button` in `style.css` so all three meet the same 44px minimum and 16px font-size floor as the main form's fields — without just copy-pasting `.field input`'s rules wholesale (`TeamLookup`'s inputs are visually a bit more compact by design; keep that, just bring the touch target up to standard).
4. Re-measure after your fix to confirm you actually hit 44px, not just "probably close enough."

## Self-Check
- [ ] I measured the actual rendered size before changing anything, not just eyeballed it
- [ ] Every input, textarea, and button inside `.team-lookup-source` is at least 44px tall after the fix
- [ ] Font size on the inputs is at least 1rem (16px)
- [ ] The rest of the app still looks and works the same — this was a sizing fix, not a redesign

## Reflection
This inconsistency existed because two different parts of the same form used two different CSS scopes, and only one of them got updated. What process — code review habit, a shared CSS utility class, a linter rule, something else — would have caught this automatically instead of requiring someone to notice it by eye?
