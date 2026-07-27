# Exercise 1: Add a Field

## Goal
Add a new field to the scouting form, end to end: markup, layout, validation, and rendering — without copying an existing field and only half-updating it.

## Scenario
Scouts keep telling you the form is missing whether a team played defense this match. Add a **"Played defense?"** checkbox field.

## Steps
1. In `scouting-form/index.html`, add a new `.field` inside the `<fieldset>` for a checkbox input, properly associated with a `<label>` (clicking the label should toggle the checkbox).
2. It doesn't need CSS changes to look reasonable, but if a checkbox squeezed into the existing `.field` flex column looks wrong to you, adjust `styles.css` — you decide what "looks wrong" means and how to fix it.
3. In `script.js`, read the checkbox's `checked` value inside `readAndValidateForm()` and include it on the returned `entry` object. A checkbox has no invalid state to validate — don't add a validation rule that can never fire.
4. In `renderEntry()`, show whether defense was played on the rendered card (e.g. a line of text, only when true — don't clutter every card with "Defense: No").
5. Submit a few entries, with the box checked and unchecked, and confirm the card reflects it correctly both times.

## Self-Check
- [ ] Clicking the label (not just the checkbox itself) toggles it
- [ ] The value makes it into the `entry` object passed to `fakeSubmitToServer`
- [ ] A submitted card visibly shows when defense was played, and doesn't say anything when it wasn't
- [ ] `form.reset()` actually resets the checkbox after each submit (check this — it's not automatic for every input type)

## Reflection
Why doesn't a checkbox need an entry in `readAndValidateForm()`'s error-checking logic the way team number and match number do? What's fundamentally different about the *kind* of value a checkbox can hold?
