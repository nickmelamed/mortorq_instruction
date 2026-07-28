# Exercise 1: Orient and Search

## Goal
Answer a handful of questions about a small project using only the shell — no editor, no file browser, no opening files by clicking on them.

## Scenario
You've just been handed `examples/sample_project/` cold, the same way you'd be handed a subsystem's code partway through a season. Before you touch anything, you need to know what's actually in it.

## Steps
1. Open a terminal and `cd` into `examples/sample_project/`. Confirm where you are with `pwd`.
2. Using `ls` (not `find` yet), look at the top level. Don't go any deeper by hand.
3. Now use `find` to answer: how many `.java` files exist in this project, no matter how deeply nested? (`find . -name "*.java"`)
4. Use `grep` to answer: exactly which lines, in which files, still contain a `TODO`? (`grep -rn "TODO" .`)
5. Use `grep` again to answer: how many `ERROR` lines are in `logs/match_12.log`?
6. Use `cat` to read `notes/deploy_notes.txt` without opening it in an editor.

## Self-Check
- [ ] I found 3 total `.java` files, in 2 different directories
- [ ] I found exactly 2 `TODO` comments, and can name both files they're in
- [ ] I found exactly 2 `ERROR` lines in the log
- [ ] I did all of this without ever opening a file in an editor or IDE

## Reflection
Notice that step 2 (`ls` on the top level) didn't get you very far by itself — `subsystems/` is a folder, not a `.java` file, so you had no way to know what was inside it without going in or using `find`. That's the whole reason `find` and `grep -r` exist: a real codebase is never one flat folder, and "look inside every nested folder for something" is a different, more powerful operation than "list what's right in front of me." This is the exact skill `10_reading_unfamiliar_code` asks you to scale up to a real, much larger codebase.
