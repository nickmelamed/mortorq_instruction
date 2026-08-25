# Exercise 2: Run a Real Linter

## Goal
See a linter catch real bugs, not just style noise.

## Scenario
`examples/lint_catches/scouting_lookup.py` runs without crashing and looks reasonable at a glance. It has three real, findable problems; the kind concept.md means by "probably bugs, not just inconsistencies."

## Steps
1. Install `ruff` if you don't already have it: `pip install ruff`.
   
2. Run `ruff check --select E,F,A scouting_lookup.py` from inside `examples/lint_catches/`. Read all three reported issues before changing anything.
   
3. For each one, explain in your own words what it's warning about and why it matters:
   - `E711` — why is `== None` worth flagging instead of just being a style preference?
   - `F841` — is an unused variable ever actually dangerous, or is this one purely about clarity? Justify your answer.
   - `A002` — what real problem could come from a parameter named `list` inside a function that also needs Python's actual `list` type?
4. Fix all three, one at a time, re-running `ruff check --select E,F,A scouting_lookup.py` after each fix to confirm that specific warning is gone.
   
5. Once all three are fixed, run the same command one more time and confirm it reports zero issues.

## Self-Check
- [ ] I ran `ruff` myself and read its real output before looking anything up
- [ ] I can explain, in my own words, what each of the three warnings actually means — not just quote the tool's message back
- [ ] I fixed all three issues one at a time, confirming each one individually before moving to the next
- [ ] `ruff check --select E,F,A scouting_lookup.py` reports zero issues on my finished file

## Reflection
None of these three problems would have shown up in a diff the way `exercise-1`'s reformatting noise did. `== None` works correctly for almost every real value you'd ever compare it against, right up until it doesn't (custom `__eq__` methods, some library types); an unused variable computed a value nobody uses, which is either dead work or a sign the function is missing a line that should have used it; and a parameter shadowing `list` is fine until something in the same function needs the real, built-in `list` and silently gets your parameter instead. This is where linters have value vs. formatters, because formatters would've given this the clear and moved along. 
