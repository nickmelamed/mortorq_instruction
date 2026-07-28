# Exercise 2: Add It, or Write It?

## Goal
Make (and justify) the judgment call of whether a dependency is worth having at all.

## Scenario
`examples/scouting_tool/format_match_number.py` imports a package called `zero_pad` (a stand-in for this exercise — it isn't a real installable package, so don't try to `pip install` it) to do exactly one thing: pad a match number to 3 digits with leading zeros, so match 7 displays as `"007"`.

```python
from zero_pad import pad


def format_match_number(match_number):
    """Format a match number as a zero-padded 3-digit string, e.g. 7 -> '007'."""
    return pad(match_number, 3)
```

## Steps
1. Using the judgment-call criteria from `concept.md` ("how much code would this replace," "how maintained is it," "what does it pull in transitively"), decide: is a whole dependency justified here?
2. Write down, in one or two sentences, what `zero_pad` is actually saving this project from writing.
3. Rewrite `format_match_number` to not depend on `zero_pad` at all, using only what's already built into the language.
4. Remove the now-unnecessary `zero_pad==0.1.0` line from `requirements.txt`.
5. Confirm your rewritten function still produces `"007"` for `7`, `"042"` for `42`, and `"123"` for `123`.

## Self-Check
- [ ] `format_match_number.py` no longer imports anything beyond the standard library
- [ ] `requirements.txt` no longer lists `zero_pad`
- [ ] The function still produces the same output for `7`, `42`, and `123`
- [ ] I can state, in one sentence, why this particular case didn't justify a dependency

## Reflection
This is the same shape as the real 2016 `left-pad` incident described in `concept.md` — a genuinely tiny, easily-hand-written piece of functionality, pulled in as a whole external dependency anyway. It's not that dependencies are bad; `numpy` and `pandas` in this same project are absolutely justified, since reimplementing either yourself would be a serious undertaking. The judgment call is about proportion: is what you're getting worth everything that comes with it — the transitive risk, the version to track, the possibility the maintainer disappears — or is `str(match_number).zfill(3)` just... already the entire solution?
