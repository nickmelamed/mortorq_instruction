# Exercise 1: Map the Full Scouting Entry Flow

## Goal
Map a real task end-to-end, including the branches it's tempting to leave out.

## Steps
1. Using boxes for screens/states and arrows for the actions that move between them, map the flow of submitting one `scouting_app` entry, starting from a blank form and ending back at a blank form ready for the next entry.
2. Add the validation-error branch: what state does the user land in if a field is invalid, what do they see, and how do they get back on the happy path.
3. Add at least one more branch beyond validation — offline submission, a duplicate entry, or another realistic failure you can identify by actually using the app or reading `scouting_app`'s form code.
4. For every arrow on your map, confirm it's labeled with the specific action that causes it (a tap, a submit, a timeout) — not just an unlabeled line.

## Self-Check
- [ ] My map includes the happy path from blank form to blank form
- [ ] My map includes the validation-error branch and how a user recovers from it
- [ ] My map includes at least one additional branch beyond validation
- [ ] Every arrow names the specific action that triggers it

## Reflection
Which branch was hardest to map — the one you understood least well before starting? What does that tell you about which part of the actual app is most likely to confuse a real user, versus which part you'd have assumed was fine without mapping it?
