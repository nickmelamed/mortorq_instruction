# Exercise 1: Unify the Duplicates

## Goal
Find a real behavioral inconsistency caused by duplicated code, then refactor it into one shared, correct implementation.

## Scenario
`examples/scouting_summary.py` has two functions, `format_auto_summary` and `format_teleop_summary`, that are almost entirely copy-pasted from each other. Run the file as-is:

```text
$ python3 scouting_summary.py
Auto: 15 pts (needs work)
Teleop: 15 pts (good)
```

Notice that the exact same point value (`15`) gets rated differently depending on which function evaluates it. This is the unintended consequence of the duplicated logic quietly drifting apart.

## Steps
1. Compare the two functions line by line and find the exact difference responsible for the inconsistent rating at `15` points.
   
2. Decide which threshold is actually correct (`> 15` or `>= 15`). There's no objectively right answer here, so pick one and be ready to justify it (e.g., "the boundary value should count as already reaching 'good'").
   
3. Extract the shared clamping-and-rating logic into one function, `rate_points(points)`, used by both `format_auto_summary` and `format_teleop_summary`, using the single threshold you picked in step 2.
   
4. After extracting the shared function (but before touching anything else), rerun the script and confirm both functions now report the *same* rating for `15` points.
   
5. Confirm the rest of the behavior is unchanged: both functions should still correctly report `"excellent"` above 30 and `"needs work"` well below the threshold, and negative point values should still clamp to `0`.

## Self-Check
- [ ] `format_auto_summary` and `format_teleop_summary` no longer duplicate the clamping/rating logic — both call one shared function
- [ ] Both functions report the same rating for `15` points
- [ ] Behavior above `30` and well below the threshold is unchanged from the original
- [ ] I can state which threshold I picked and why, in one sentence

## Reflection
This inconsistency wasn't caused by anyone making an obvious mistake. It was simply the consequence of duplication, and it illustrates the importance of catching it before code begins to grow larger. Right now, the fix is trivial; if it gets buried in our codebase, the fix becomes a wild goose chase. 
