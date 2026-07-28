# Exercise 1: Watch It Slow Down

## Goal
Notice, just by watching real runtimes, that a nested-loop search slows down much faster than a single-pass search does as the input grows — without deriving or calculating any Big-O notation.

## Scenario
`examples/find_duplicates/find_duplicates.py` has two ways to find a duplicate entry in a list of numbers: `naive_find_duplicate` (checks every entry against every other entry) and `fast_find_duplicate` (remembers what it's already seen in a set, and only makes one pass). `benchmark.py` times both against lists of increasing size, with no actual duplicate present, so each function has to check as much as it possibly can before concluding there isn't one.

## Steps
1. From `examples/find_duplicates/`, run `python3 benchmark.py` and record the full table of timings.
2. Look at the `naive` column. Each row roughly doubles `n` compared to the row above it. Roughly how many *times* bigger is each `naive` timing than the one before it — closer to 2x, or closer to 4x?
3. Now look at the `fast` column across the same rows. Does it grow anywhere near as dramatically?
4. Without writing any Big-O notation, describe in your own words what would happen to `naive_find_duplicate`'s runtime if you doubled `n` two more times past the largest value in the table (i.e., 4x past 8000).
5. Confirm both functions still give the *correct* answer, not just different speeds: run them both against a small list with a real duplicate injected (`make_entries(20, inject_duplicate=True)`) and confirm they report the same duplicate value.

## Self-Check
- [ ] I recorded the actual timing table from `benchmark.py`
- [ ] I can state, approximately, the multiplier between consecutive rows in the `naive` column (should be roughly 4x, not 2x)
- [ ] I can state, in one sentence with no formulas, why doubling the input roughly quadruples `naive`'s work but barely affects `fast`'s
- [ ] I confirmed both functions return the correct, matching duplicate value on the small injected-duplicate case

## Reflection
Notice you never had to calculate anything to notice the problem — the table made it obvious by itself. That's the actual skill this module is teaching: you don't need to derive Big-O on the spot to feel when something is shaped like it's going to get much worse as data grows, you just need to have seen this shape once before and recognize it again. `language_primer/03_data_structures_algorithms` will give you the formal vocabulary (`O(n²)` vs. `O(n)`) for exactly what you just watched happen — but the instinct you just built, watching real numbers blow up, is the part that actually transfers to noticing this in code you write yourself, long before you stop to do the math.
