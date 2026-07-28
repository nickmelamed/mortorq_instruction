# 12 - Complexity & Performance Intuition

## This is a teaser, not the real thing

`back_end_resources/language_primer/03_data_structures_algorithms` already covers Big-O properly — formal notation, time vs. space, and a real comparison of linear scans, binary search, and hashmap lookups, tied directly to the robot's 20-millisecond control loop. This module exists *before* that one, for a simpler reason: you don't need any formal notation at all to develop a gut feeling for "this might be slow," and that instinct is worth having as early as you're writing your first few functions — long before you're ready for a formal treatment of complexity. Treat this module as the intuition that makes `language_primer/03` click faster when you get there, not a substitute for it.

## The shape to notice: a loop inside a loop

The single most common performance footgun, and the one worth being able to spot on sight, is a loop nested inside another loop, where the inner loop's work scales with the *same* growing amount of data as the outer one. If you have `n` items and, for *every single one*, you loop through all `n` again, you're doing roughly `n` times `n` — `n²` — pieces of work in total. You don't need Big-O notation to feel why that's dangerous: double the input, and the work roughly **quadruples**, not doubles. Ten items becomes 100 units of work; a hundred items becomes 10,000; a thousand becomes a million. A single loop over the same growing data, by contrast, just doubles when the input doubles — a completely different, much gentler shape.

## When this actually matters

A nested loop over 6 robots on a field, or 3 subsystems, or 20 scouting entries from one match, is completely fine, no matter how it's written — `n²` is only dangerous once `n` itself gets large enough for the *quadrupling* to actually show up as real, noticeable time. A whole season's worth of scouting data, thousands of frames of camera input, or any dataset that keeps growing over time are exactly the situations where "it was fine when we tested it with 20 rows" quietly turns into "it takes 30 seconds now that we have 4,000 rows." The skill isn't "avoid nested loops" — plenty of nested loops are perfectly reasonable, especially over small or fixed-size data. The skill is noticing when the data a nested loop touches is the kind that's likely to keep growing, and treating that specific combination as worth a second look.

## Putting it together

Open `examples/find_duplicates/` — two ways of finding a duplicate entry in a list: `naive_find_duplicate` (a nested loop, checking every entry against every other entry) and `fast_find_duplicate` (a single pass, remembering what it's already seen). Run `benchmark.py` and watch what happens to each one's runtime as the input size doubles, again and again — no Big-O notation required to notice the difference.

## See also

- **`back_end_resources/language_primer/03_data_structures_algorithms`** — the real, formal treatment of Big-O (time and space), hashmaps, and binary search this module is a light preview of.
- **`09_refactoring_technical_debt`** — once you've noticed a footgun like this, deciding whether and how to fix it is exactly that module's incremental-refactoring skill, applied to a performance smell instead of a naming or structure one.

## Resources

- [Big-O Cheat Sheet](https://www.bigocheatsheet.com/) - the same reference `language_primer/03_data_structures_algorithms` points to; a quick, visual look at how different growth shapes compare, if you're curious ahead of that module.
