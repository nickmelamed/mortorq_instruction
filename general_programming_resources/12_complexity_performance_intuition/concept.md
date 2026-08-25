# 12 - Complexity & Performance Intuition

## Intuition, not Notation 

`back_end_resources/language_primer/03_data_structures_algorithms` already covers Big-O properly. This module is to build intuition behind why complexity matters. 

## A Loop inside a Loop

The single most common performance tanker is a nested loop, or a loop inside another loop. If you have `n` items and, for *every single one*, you loop through all `n` again, you're doing roughly `n` times `n` — `n²` — pieces of work in total. You don't need Big-O notation to feel why that's dangerous: double the input, and the work roughly **quadruples**, not doubles. Ten items becomes 100 units of work; a hundred items becomes 10,000; a thousand becomes a million. A single loop over the same growing data, by contrast, just doubles when the input doubles.

## The Hidden Version: No Second Loop in Sight

Not every quadratic footgun looks like two nested `for` loops sitting next to each other. The far more common trap is a single loop with a membership check inside it — `if item in some_list` — where `some_list` is a plain list, not a set. Checking whether something is `in` a list means scanning it from the start, so doing that once per iteration of an already-growing list is secretly the same `n`-times-`n` shape as an explicit nested loop, just with the second loop hidden inside one line instead of written out as its own `for`. `in` on a `set` (or a `dict`'s keys) doesn't have this problem, because membership there is checked in roughly constant time no matter how large it gets, which is the actual reason `fast_find_duplicate` below uses a `set` for `seen` instead of a `list`. Nobody accidentally writes two nested `for` loops; plenty of people accidentally write this.

## When this actually matters

A nested loop over 6 robots on a field, or 3 subsystems, or 20 scouting entries from one match, is completely fine, no matter how it's written; `n²` is only dangerous once `n` itself gets large enough for the *quadrupling* to actually show up as real, noticeable time. A whole season's worth of scouting data, thousands of frames of camera input, or any dataset that keeps growing over time are exactly the situations where you notice the performance latencies. Plenty of nested loops are perfectly reasonable, especially over small or fixed-size data. The skill is noticing when the data a nested loop touches is the kind that's likely to keep growing, and analyzing where you can make an effective change. 

## Putting it Together

Open `examples/find_duplicates/`. You'll find three ways of finding a duplicate entry in a list: `naive_find_duplicate` (a nested loop, checking every entry against every other entry), `fast_find_duplicate` (a single pass, remembering what it's already seen in a `set`), and `hidden_quadratic_find_duplicate` (also a single pass, textually — but remembering what it's seen in a plain `list` instead). Run `benchmark.py` and watch what happens to each one's runtime as the input size doubles, again and again — no Big-O notation required to notice the difference. A real run of the first two looks like this (both bar charts below use the *same* scale, so the heights are directly comparable — `exercises/exercise-1-watch-it-slow-down.md` has you run the third function yourself and see which of these two shapes it actually matches):

```text
     n   naive_find_duplicate (nested loop)
   500   █                                    0.0042s
  1000   █                                    0.0162s
  2000   ██                                   0.0574s
  4000   █████████                            0.2318s
  8000   ████████████████████████████████████ 0.9162s

     n   fast_find_duplicate (single pass)
   500   █                                    0.000014s
  1000   █                                    0.000022s
  2000   █                                    0.000062s
  4000   █                                    0.000077s
  8000   █                                    0.000160s
```

Notice what the bars do, not just the numbers next to them: `naive`'s bar visibly grows almost every row, while `fast`'s stays pinned to a single character the whole way down the table. This is the "quadruples vs. barely moves" shape this module's first section describes, made visible instead of something you have to compute by eye from a column of digits.

## See also

- **`back_end_resources/language_primer/03_data_structures_algorithms`** — the real, formal treatment of Big-O (time and space), hashmaps, and binary search this module is a light preview of.
- **`09_refactoring_technical_debt`** — once you've noticed a footgun like this, deciding whether and how to fix it is exactly that module's incremental-refactoring skill, applied to a performance smell instead of a naming or structure one.

## Resources

- [Big-O Cheat Sheet](https://www.bigocheatsheet.com/) - the same reference `back_end_resources/language_primer/03_data_structures_algorithms` points to; a quick, visual look at how different growth shapes compare, if you're curious ahead of that module.
