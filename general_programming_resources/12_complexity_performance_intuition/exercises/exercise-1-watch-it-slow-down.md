# Exercise 1: Watch It Slow Down

## Goal
Notice, just by watching real runtimes, that a nested-loop search slows down much faster than a single-pass search does as the input grows.

## Scenario
`examples/find_duplicates/find_duplicates.py` has three ways to find a duplicate entry in a list of numbers: `naive_find_duplicate` (checks every entry against every other entry), `fast_find_duplicate` (remembers what it's already seen in a `set`, and only makes one pass), and `hidden_quadratic_find_duplicate` (also only makes one textual pass — but remembers what it's seen in a plain `list` instead of a `set`). `benchmark.py` times all three against lists of increasing size, with no actual duplicate present, so each function has to check as much as it possibly can before concluding there isn't one.

## Steps
1. From `examples/find_duplicates/`, run `python3 benchmark.py` and record the full table of timings.
   
2. Look at the `naive` column. Each row roughly doubles `n` compared to the row above it. Roughly how many *times* bigger is each `naive` timing than the one before it — closer to 2x, or closer to 4x?
   
3. Now look at the `fast` column across the same rows. Does it grow anywhere near as dramatically?
   
4. Without writing any Big-O notation, describe in your own words what would happen to `naive_find_duplicate`'s runtime if you doubled `n` two more times past the largest value in the table (i.e., 4x past 8000).
   
5. Confirm all three functions still give the *correct* answer, not just different speeds: run them against a small list with a real duplicate injected (`make_entries(20, inject_duplicate=True)`) and confirm all three report the same duplicate value.
   
6. Before looking at the `hidden` column, open `find_duplicates.py` and read `hidden_quadratic_find_duplicate`. Count its `for` loops. Based on that alone, which existing column — `naive` or `fast` — would you predict it matches?
   
7. Now look at the `hidden` column in your recorded table. Which one does it actually match? Find the one line responsible for the difference between `hidden_quadratic_find_duplicate` and `fast_find_duplicate`, and explain in one sentence why that single-line difference is enough to change which shape it matches.

## Self-Check
- [ ] I recorded the actual timing table from `benchmark.py`, including the `hidden` column
- [ ] I can state, approximately, the multiplier between consecutive rows in the `naive` column (should be roughly 4x, not 2x)
- [ ] I can state, in one sentence with no formulas, why doubling the input roughly quadruples `naive`'s work but barely affects `fast`'s
- [ ] I confirmed all three functions return the correct, matching duplicate value on the small injected-duplicate case
- [ ] My step-6 prediction is written down before my step-7 answer, so I can honestly compare what the loop count alone suggested against what actually happened
- [ ] I can name the exact single-line difference (`list` vs. `set`) responsible for `hidden_quadratic_find_duplicate` matching `naive`'s shape instead of `fast`'s

## Reflection
The table made the problem obvious by itself. You don't need to derive Big-O on the spot to feel when something is shaped like it's going to get much worse as data grows, you just need to have seen this shape once before and recognize it again. `back_end_resources/language_primer/03_data_structures_algorithms` will give you the formal vocabulary (`O(n²)` vs. `O(n)`) for exactly what you just watched happen, but the instinct you just built, watching real numbers blow up, is the part that actually transfers to noticing this in code you write yourself. Steps 6 and 7 are the more important half, though: counting `for` loops is exactly the instinct this module's first section teaches, and it was wrong here. `hidden_quadratic_find_duplicate` has exactly one `for` loop, textually identical in shape to `fast_find_duplicate` — the entire difference is `seen = []` instead of `seen = set()`, one word, with no loop anywhere near it. The lesson isn't "count your loops," it's "know what the operations inside your loop actually cost."
