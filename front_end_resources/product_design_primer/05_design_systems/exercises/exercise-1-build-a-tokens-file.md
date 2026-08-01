# Exercise 1: Build a Tokens File

## Goal
Turn a set of one-off visual decisions into named values that could actually be imported into real code.

## Steps
1. Using your color, type, and spacing decisions from `04`, write a CSS custom-properties file (`:root { ... }`) naming each value — colors, spacing steps, font sizes — following the shape in `concept.md`.
2. Include at least one non-purely-visual constraint as a token too (a minimum touch target size, for instance), and give it a name that describes what it's for, not just what it is.
3. Review your token names: could someone who never saw your original mockup guess what each one is for, just from its name?
4. Rename any token whose purpose isn't clear from its name alone (e.g. `--color-1` tells you nothing; `--color-alliance-red` does).

## Self-Check
- [ ] Every color, spacing, and type value from `04` has a corresponding named token
- [ ] At least one non-color/type/spacing constraint (like a touch-target minimum) is represented as a token
- [ ] Every token name describes its purpose, not just its value
- [ ] The file is small enough that someone could read the whole thing in under a minute

## Reflection
Pick one token and imagine changing its value six months from now. What else in a real app would need to change along with it if this value had instead been hardcoded in five different places?
