# Exercise 2: Bisect the Regression

## Goal
Find exactly which of six versions of a function introduced a bug, by checking as few of them as possible — instead of testing all six in order.

## Scenario
`examples/bisect_the_regression/versions/` has six versions (`v1.py` through `v6.py`) of a match-scoring function, representing six sequential edits over time. `v1.py` is known good — it was tested and trusted when it was written. `v6.py`, the current version, is known bad — it's been reported that scores are coming out wrong. Somewhere between `v1` and `v6`, a change broke it, and every version after that one inherited the same bug.

`check_version.py` checks any one version against a known-correct expected result for a fixed test case:

```text
$ python3 check_version.py v1
v1: PASS (total_score = 47)
```

Run this from inside `examples/bisect_the_regression/`.

## Steps
1. Confirm the two endpoints yourself: run `check_version.py v1` (should PASS) and `check_version.py v6` (should FAIL).
2. **Do not check v2, v3, v4, v5 in order.** Instead, check the *middle* of the remaining range first — `v3` or `v4` — and use whether it passes or fails to cut the remaining range in half, the same way `git bisect` would.
3. Keep narrowing: after your first middle check, you'll have a smaller range with one known-good and one known-bad boundary. Pick the middle of *that* narrower range next.
4. Stop as soon as you've found the exact version that's the first one to fail, with the version right before it still passing. You should be able to do this in 3 total checks (beyond the two endpoints you already confirmed in step 1).
5. Open that exact version's file and the one immediately before it, and diff them by eye. State, in one sentence, exactly what changed and why it broke the result.

## Self-Check
- [ ] I found the exact first-failing version using 3 or fewer checks beyond the two endpoints (not by checking every version in order)
- [ ] I can name the exact version where the bug was introduced
- [ ] I can state, in one sentence, the specific line that changed and why it produces the wrong result
- [ ] I did not need to read every version's full source to find the answer — the PASS/FAIL results alone narrowed it down

## Reflection
Six versions only needed 3 checks to pinpoint, because each check eliminates half of whatever's left, not just one version at a time — the same reason binary-searching a sorted list of a million items only takes ~20 comparisons, not a million. This scales precisely the way it needs to: a regression introduced 500 commits ago is only about 9 checks away with bisection (`log2(500) ≈ 9`), versus up to 500 if you insisted on checking commits one at a time in order. `git bisect` runs exactly this algorithm against your real commit history — this exercise is the same process with six files standing in for six commits.
