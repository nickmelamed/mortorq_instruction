# Exercise 1: Fix the Scheduler

## Goal
Find and fix two separate reproducibility bugs in the same small script: one caused by unseeded randomness, one caused by a hardcoded "works on my machine" assumption.

## Scenario
`examples/practice_scheduler/schedule.py` assigns three robots to three practice time slots and logs the result to a file. Run it twice:

```text
$ python3 schedule.py
9:00: Robot C
9:20: Robot B
9:40: Robot A
Traceback (most recent call last):
  ...
FileNotFoundError: [Errno 2] No such file or directory: '/Users/coach/robotics/practice_data.csv'
```

Notice two separate problems: the assignment is different every run, and it crashes trying to write its log.

## Steps
1. **The randomness bug:** find where `random.shuffle` is called. Change it so the assignment is reproducible on demand. The function should accept a `seed` parameter, and the same seed should always produce the same assignment. Don't just hardcode one seed forever with no way to change it, because a real scheduler still needs the *option* of a genuinely different assignment. The fix is making the seed explicit and controllable, not eliminating randomness entirely.
   
2. Run your fixed version twice with the same seed and confirm the assignment is now identical both times.
   
3. **The path bug:** find `PRACTICE_LOG_PATH`. Explain, in one sentence, why this path only ever worked on the machine it was written on.
   
4. Fix it so the log file is written next to `schedule.py` itself, regardless of which machine or which folder someone runs the script from. (Look at how `03_file_project_structure`'s exercise handled a similar path problem — `pathlib.Path(__file__).parent` gives you the folder a script lives in, regardless of the current working directory.)
   
5. Run your fully fixed script twice in a row and confirm: identical assignment both times, and no crash.
   
6. **Pin the runtime, too.** Dependency versions aren't the only thing worth pinning — per `concept.md`'s "Environment Pinning" section, the language runtime itself needs it as well. Check your Python version with `python3 --version`, then add a `.python-version` file next to `schedule.py` naming it. This doesn't fix a bug the way steps 1-4 did; it closes the same gap for the next person setting this project up fresh, who currently has no way to know which Python version this was ever actually run against.

## Self-Check
- [ ] `assign_practice_slots` takes a `seed` parameter, and the same seed produces the same assignment every time
- [ ] The script runs to completion twice in a row with no crash
- [ ] The log file is written correctly regardless of the current working directory the script is run from
- [ ] I can state, in one sentence each, why the original version of each bug wasn't reproducible
- [ ] A `.python-version` file exists next to `schedule.py`, naming the actual version I tested it with

## Reflection
Both bugs have the same underlying shape, even though they look completely different. Each one worked *only* because of something true about one specific run, on one specific machine, that was never written down anywhere. Fixing them wasn't about removing randomness or file logging; it was about making both dependencies explicit and controllable instead of implicit and assumed.
