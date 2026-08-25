# Exercise 1: Find the Real Change

## Goal
See, concretely, how inconsistent formatting turns a one-line logic change into a noisy diff. You'll then see how keeping formatting consistent prevents this noise from proliferating. 

## Scenario
`examples/style_diff/` has three files. `v1_original.py` is the starting point. `v2_mixed_change.py` and `v3_clean_change.py` both make the *exact same* real change to it (rejecting non-integer scores); `v2` also happens to have had its quotes reformatted from single to double by someone's editor in the same pass, while `v3` doesn't.

## Steps
1. From `examples/style_diff/`, run `diff v1_original.py v2_mixed_change.py`. Count how many lines the diff reports as changed.
   
2. Read through that diff and sort every reported change into one of two piles: **real behavior change** (would actually affect what the program does) or **formatting noise** (quote style, whitespace — no effect on behavior).
   
3. Now run `diff v1_original.py v3_clean_change.py` and count how many lines *that* diff reports.
   
4. Confirm: `v2` and `v3` both add the exact same behavior (try feeding both a non-integer input, like `is_valid_score(4.5)`, and confirm they return the same result), despite one producing a much noisier diff than the other.

## Self-Check
- [ ] I can state exactly how many lines each diff reports (they should differ)
- [ ] I correctly identified which lines in the `v1`->`v2` diff are real behavior changes vs. pure formatting noise
- [ ] I confirmed `v2` and `v3` behave identically for the same inputs, despite their different diffs against `v1`
- [ ] I can explain, in one sentence, why a reviewer would find `v3`'s diff easier to review than `v2`'s

## Reflection
`v2` and `v3` are functionally identical; same behavior change, same result for every input. The only difference is that `v2`'s diff forces a reviewer to do the mental work of separating formatting changes from real behavioral changes. Multiply that friction across a real pull request with dozens of files, and the value of running a formatter consistently — so this kind of noise never enters a diff in the first place — stops being a style preference and starts being a real, measurable cost. 
