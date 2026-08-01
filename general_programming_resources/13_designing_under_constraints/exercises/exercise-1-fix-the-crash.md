# Exercise 1: Fix the Crash

## Goal
Make `sync_scores.py` survive a single dropped API call instead of crashing outright.

## Scenario
Run it as-is first, from inside `examples/tba_sync/`:

```text
$ python3 sync_scores.py
Traceback (most recent call last):
  ...
ConnectionError: TBA request timed out (venue wifi)
```

`fake_tba_api.py`'s 4th call always raises `ConnectionError`, standing in for one dropped request during a live event — not a rare edge case, just what happens when you depend on venue wifi. `sync_scores.py` never expected that, so the whole script dies on a single bad call.

## Steps
1. Read `fake_tba_api.py` well enough to know *when* the failure happens and what it raises — don't guess, confirm it by reading the source, per `06_debugging_methodology`.
2. Change `sync_until_stable` in `sync_scores.py` so a `ConnectionError` from `api.get_average_score()` doesn't crash the script. Pick one concrete strategy and implement it — for example, retry the call a bounded number of times, or fall back to the last successfully-read value if retries are exhausted. Whichever you pick, it should be a deliberate choice, not just a bare `except: pass`.
3. Run it again. It should now complete without an unhandled exception.

## Self-Check
- [ ] I identified exactly which call fails and why, by reading the code, before changing anything
- [ ] The script no longer crashes on the 4th call
- [ ] My fix has a bound (a max retry count, or an explicit fallback) — it doesn't just retry forever, which would trade one way of hanging for another
- [ ] I can explain in one sentence what a real venue-wifi dropout would look like to this code, and why "assume every call succeeds" was the actual bug, not the specific `ConnectionError`

## Reflection
This is `frc_resources`' "no usable internet in the pits" constraint showing up somewhere that has nothing to do with CAN bus wiring — the exact same unreliable-network problem reaches any code that calls an API you don't control, hardware or not.
