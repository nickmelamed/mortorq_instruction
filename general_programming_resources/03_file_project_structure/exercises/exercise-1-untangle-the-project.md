# Exercise 1: Untangle the Project

## Goal
Reorganize a small, working, but badly-structured project into a layout a new reader could understand at a glance — without changing what it actually computes.

## Scenario
`examples/tangled_project/` is a real tool a previous student wrote: it reads match cycle times from a CSV and prints the average. It works. It's also a mess: source code, a test, real setup instructions (mislabeled `notes.txt`), a stale duplicate file, and a leftover output artifact are all dumped into one flat folder with no separation at all.

## Steps
1. Run it as-is first: `cd examples/tangled_project && python3 main.py`. Confirm it prints `Average cycle time: 14.50s`. Also run `python3 test_helpers.py` and confirm it passes.
2. Read every file in the folder (`notes.txt` included) and decide, for each one, what role it's actually playing: source code, a test, configuration, documentation, sample data, or cruft nobody's confirmed is safe to remove.
3. Create a clearer structure: a `src/` folder for source code, a `tests/` folder for the test, a `data/` folder for the CSV, and a proper `README.md` at the top level (rewritten from `notes.txt`'s content, in your own words).
4. Decide what to do with `old_main_v2.py` and `test_output.txt`. Neither is source, a test, config, docs, or data — figure out what each one actually is and justify removing it (or, if you'd rather be cautious, moving it somewhere clearly marked as unused, like an `archive/` folder — either is a defensible call, as long as you can say why).
5. Moving `main.py` will break the hardcoded path it uses to find `match_data.csv` (`"match_data.csv"` won't resolve the same way once `main.py` and the CSV are in different folders). Find and fix that path so the tool still runs correctly from its new location.
6. Re-run `main.py` and `test_helpers.py` from their new locations and confirm both still work exactly as before.

## Self-Check
- [ ] `src/`, `tests/`, and `data/` exist, each containing only the files that belong there
- [ ] A `README.md` exists at the top level with real setup/usage instructions, not `notes.txt`
- [ ] `old_main_v2.py` and `test_output.txt` are gone, or clearly isolated somewhere marked as unused — either way, you can explain why
- [ ] `main.py` still prints `Average cycle time: 14.50s` after being moved
- [ ] `test_helpers.py` still passes after being moved

## Reflection
Notice that reorganizing wasn't actually free — moving `main.py` broke a hardcoded path, and you had to go fix it. That's a real, common cost of restructuring a project: file locations and the references between them are coupled (the same idea from `02_code_organization_modularization`), and moving one without checking the other silently breaks things. This is also exactly the situation `09_refactoring_technical_debt` is about: improving structure in something that already works, carefully enough that it still works when you're done.
