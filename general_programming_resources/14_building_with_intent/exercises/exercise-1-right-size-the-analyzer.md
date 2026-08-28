# Exercise 1: Right-Size the Analyzer

## Goal
Strip out abstraction nobody's actually using, then add the error handling the script's real, repeated use at real events actually demands.

## Scenario
`examples/scouting_analyzer/analyzer.py` computes one number — average scouting points per match — but is built as a four-piece strategy/factory hierarchy, with only the "average" path ever actually called anywhere. At the same time, it has no handling at all for the two things that already happen in real use: the CSV being missing, and a row having something other than a number in the points column (a scout writing "DNP" for a match a robot didn't play, for instance).

## Steps
1. Run `analyzer.py` and record the exact printed output.
   
2. Read the whole file and find every strategy and every `Config` field that's never actually invoked or read anywhere in the project. (`grep -rn "MedianStrategy\|WeightedStrategy\|Config(" .` from inside `scouting_analyzer/` is a fast way to confirm what's genuinely dead versus what's actually called.)
   
3. Delete the unused machinery — `MedianStrategy`, `WeightedStrategy`, `AnalyzerFactory`, `Config`, and the `AnalysisStrategy` base class — and replace the whole thing with one direct function that does exactly what `AverageStrategy.analyze` did. Apply `concept.md`'s rule: generalize again only once a second real, current caller actually needs a different calculation, not before.
   
4. Now trigger both real failure modes and see what actually happens today: temporarily rename `scouting_data.csv` out of the way and rerun; put it back, then temporarily edit one row's points value to something non-numeric (like `DNP`) and rerun. Confirm both produce a raw Python traceback.
   
5. Add handling for both cases with a clear, explicit fallback per `13_designing_under_constraints`'s framing — for example, a missing file prints a clear message and exits instead of crashing, and a malformed row is skipped (with a printed warning naming which row) instead of taking down the whole run.
   
6. Re-run all three cases: valid data should print the exact same number as step 1; the missing-file case and the malformed-row case should each produce a clear, human-readable message instead of a traceback.

7. **Now the second need actually shows up.** The scouting lead asks for the median score too, alongside the average, since one blowout match can skew an average in a way a median wouldn't. This is exactly the "second real, current caller" `concept.md`'s rule is about — not a hypothetical one. Write a `median_points(matches)` function next to `average_points`, computing the actual median of the points column, and print both when you run the script. (Compute it directly; don't reach for a library.)

8. Before moving on, look back at what you deleted in step 3; `MedianStrategy` was already sitting in the original file, unused. Resist rebuilding anything like the `AnalysisStrategy`/`AnalyzerFactory` pattern you removed. Two plain functions (or one function taking a `method` argument with a simple `if`/`elif`) is still the right amount of structure for exactly two real callers.

## Self-Check
- [ ] No unused strategy classes, factory, or `Config` object remain in the file
- [ ] The remaining code is one direct function, not a class hierarchy, for the one calculation actually used
- [ ] A missing CSV file produces a clear message, not a raw traceback
- [ ] A malformed row produces a clear message (naming the bad row) instead of crashing the whole run
- [ ] Valid data still produces the exact same output as the original script
- [ ] I can state, in one sentence, why the original abstraction wasn't "extra safety" — it was effort spent in the wrong place
- [ ] `median_points` exists as a plain function (or a simple parameter branch), not a reintroduced class hierarchy, once the second real need showed up
- [ ] I can explain, in one sentence, why having two real callers still didn't justify rebuilding the strategy/factory pattern

## Reflection
Notice where the effort in the original file actually went: three strategy classes and a config object nobody used, versus zero lines spent on the two failure modes that happen every single time a scout reruns this at a real event. It's the natural result of building for an imagined future ("what if we need other analysis types someday") instead of the real, current situation (this script is quietly production code now). `09_refactoring_technical_debt` is the mirror image of what you just did: that module removes structure debt that piled up from doing too little; this exercise removed structure that was never earned by doing too much, and then spent the effort it freed up on the two things this script actually needed to survive. Steps 7 and 8 close the other half of the loop: `concept.md`'s rule says generalize once a second real caller shows up, but it never said *how much* — the second caller here justified a second function, not the resurrection of everything you just deleted. "You now have two real cases" and "you now need an abstract base class" are two different claims, and only the first one was ever actually true.
