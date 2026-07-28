# 09 - Refactoring & Technical Debt

## Debt is a tradeoff, not a verdict

**Technical debt** is the gap between the fastest way to ship something and the cleanest way to build it — and, like financial debt, taking it on deliberately isn't automatically a mistake. Shipping a slightly messy solution on purpose, days before a competition, because it works and there's no time left to do better, is a legitimate engineering decision. What makes debt dangerous isn't that it exists — it's when it's taken on *without anyone deciding to*, and nobody ever comes back to pay it down, so the next change has to build on an already-shaky foundation, and the one after that builds on something shakier still. This module is about recognizing when code has drifted into that second situation, and how to fix it without breaking what already works.

## Recognizing code smells

A **code smell** isn't a bug — the code still runs — it's a pattern that tends to predict a *real* problem showing up later. A few of the most common ones:

- **Duplicated code** — the same logic, copy-pasted in two or more places. The danger isn't the extra typing, it's that duplicates *drift*: someone fixes a bug or changes a rule in one copy and never finds the other, and now the two copies quietly disagree.
- **Long / "god" functions** — a function doing too many unrelated things at once. You've already seen and fixed this exact smell in `02_code_organization_modularization`.
- **Shotgun surgery** — one conceptual change (e.g., "rename this constant") requires editing a dozen scattered files. Usually a sign related things aren't grouped together the way `03_file_project_structure` describes.
- **Long parameter lists** — a function needing six or seven arguments to do its job is usually a sign several of them belong bundled together as one object instead.
- **Dead code** — code that no longer runs or matters, left in "just in case." You've already seen this exact smell too, in `03_file_project_structure`'s stale `old_main_v2.py`.

None of these prove something is wrong by themselves — they're a signal worth investigating, not an automatic verdict.

## Refactoring incrementally, without breaking things

**Refactoring** means changing code's internal structure without changing its external behavior — same inputs still produce the same outputs, just organized more clearly. The way to do this safely:

1. **Change one thing at a time.** Fix one smell, not five at once — if something breaks, you want to know exactly which change caused it.
2. **Verify behavior after every step**, not just at the end. Run the code (or its tests, if it has them — this is exactly where `07_testing_philosophy`'s test suite earns its keep) after each small change, not after a large batch of them.
3. **Never refactor and add a feature in the same change.** Mixing "I made this clearer" with "I also added new behavior" makes it much harder to tell, if something breaks, which of the two changes actually caused it.
4. **Use version control as your safety net.** Commit each small, verified step separately (see `git_resources`) — if a later step goes wrong, you can cleanly get back to the last point you know worked, instead of untangling a single giant, all-at-once change.

## When debt is fine, and when it compounds

Debt taken on **deliberately** — a `TODO` comment with a plan, a known shortcut everyone agreed to, a decision made under a real deadline with eyes open — is manageable, and sometimes the entire season simply ends before it would ever need to be paid back at all; that's a legitimate outcome, not a failure. Debt that accumulates **silently** is the dangerous version: nobody decided to take it on, nobody wrote it down, and more code quietly gets built on top of it every week it goes unnoticed. The longer that goes on, the more expensive the eventual fix gets, because by the time someone notices, the shaky part isn't a small, isolated piece anymore — it's load-bearing for everything built on top of it since. The real skill isn't "never take on debt" — it's noticing the difference between debt you chose and debt that snuck in, and treating the second kind with real urgency once you spot it.

## Putting it together

Open `examples/scouting_summary.py` — two functions that are almost entirely duplicated code, with one detail that quietly drifted between the two copies along the way. Run it once as-is, then refactor it in `exercises/`.

## See also

- **`02_code_organization_modularization`** — the single-responsibility/naming refactor you already did there is the same underlying skill this module names and generalizes.
- **`03_file_project_structure`** — the stale file and structural cleanup from that exercise are both examples of the debt/smells this module gives names to.
- **`07_testing_philosophy`** — a real test suite is what makes step 2 of "refactoring incrementally" (verify behavior after every step) fast and reliable instead of manual and error-prone.
- **`git_resources`** — small, separately committed refactoring steps as the safety net described above.

## Resources

- [Refactoring.Guru: Code Smells](https://refactoring.guru/refactoring/smells) - a fuller catalog of code smells than this module's short list, each with its own typical fix.
- [Martin Fowler: Technical Debt](https://martinfowler.com/bliki/TechnicalDebt.html) - the original "debt" metaphor (Ward Cunningham's), and Fowler's own extension of it, from one of the field's most-cited voices on the topic.
