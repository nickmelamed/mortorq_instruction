# Exercise 2: Fix the Script (Break This on Purpose)

## Goal
Find and fix a real, common shell mistake, not by guessing, but by reasoning about what a command actually does versus what its author assumed it does.

## Scenario
A teammate wrote `examples/broken_script.sh` to print a quick pre-practice summary: every open `TODO` in the code, and how many errors showed up in the last match log. They know from `notes/deploy_notes.txt` that there should be **two** TODOs. The script only finds one, and they can't figure out why.

## Steps
1. From inside `examples/sample_project/`, run `bash ../broken_script.sh` and confirm it reports only 1 TODO, alongside a correct error count of 2.
   
2. Before changing anything, run `find src -name "*.java"` and compare that list to what `ls src/*.java` shows you (try both). Notice the difference.
   
3. Once you can explain *why* `src/*.java` misses one of the two TODO-containing files, fix `broken_script.sh` so it searches recursively instead. Do this using either `grep -r` directly, or `find` piped into `grep`.
   
4. Re-run the script and confirm it now reports both TODOs, with the correct file for each, while the error count (which was never broken) still reports 2.

## Self-Check
- [ ] I can state, in one sentence, why `src/*.java` didn't find the TODO in `subsystems/Drivetrain.java`
- [ ] The fixed script reports 2 TODOs, one from `Arm.java` and one from `subsystems/Drivetrain.java`
- [ ] The fixed script's error count is still 2 (I didn't need to touch that part)

## Reflection
The bug wasn't a typo; `src/*.java` is a perfectly valid pattern, it just means something narrower than the teammate assumed: "every `.java` file directly inside `src`," not "every `.java` file anywhere under `src`." A glob like `*` never looks inside subfolders on its own. This is exactly the gap `grep -r` and `find` are built to close, and it's worth remembering the next time a search "isn't finding something that's obviously there", sometimes the most likely explanation is that it's one directory deeper than the tool was told to look.
