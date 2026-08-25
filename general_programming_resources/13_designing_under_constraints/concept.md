# 13 - Designing Under Constraints

## Correct isn't Enough

A pure function has an obvious definition of correct: given this input, produce exactly that output. Most of what you've written so far in this curriculum works that way. But the moment your code moves into real-world applications, correct becomes "correct"; there isn't a clear-cut definition. You start handling edge cases, robot size constraints, and so many more things that make the "right" answer a lot more difficult to find. 

This module is about habits that help you deal with building code that works against constraints you're often given during competition season. 

## Define Success, Before You Write the Loop 

Waiting for exact equality against a value you don't fully control is a bug waiting to happen:

```python
while current_value != target_value:
    current_value = read_value()
```

If `target_value` is a float, if it's produced by something still converging (a sensor settling, a live feed still updating), or if it can change while you're polling it, this loop may never see the two sides land on the exact same value. 

The fix isn't a smarter loop, it's a different question. You should think about this as "are these values close enough", not "are they exactly the same". 

```python
TOLERANCE = 0.5

while abs(current_value - target_value) > TOLERANCE:
    current_value = read_value()
```

That tolerance is a decision *you* make, deliberately, before you write the loop. Ideally, you have a strong rationale for picking this threshold. "Close enough" shows up everywhere, not just with numbers: a UI polling for a background job stops when the job reports done, not when some internal counter hits an exact value; a search that never finds a perfect match still needs to know when to return its best candidate instead of running forever. `back_end_resources/systems_primer/04_control_loops_pid` is the deep, hardware-flavored version of exactly this idea.

## Every External Input Can Fail

Code that only handles the case where everything works is code that hasn't met production yet:

```python
data = fetch_from_api()
process(data)
```

This line is a bet that the network call always succeeds, always returns in a reasonable amount of time, and always returns the shape of data you expect. Every one of those assumptions is a specific way this can fail — a dropped connection, a slow response, a malformed payload — and all of them happen more frequently than you would expect. The fix isn't to handle every conceivable failure, it's to decide, deliberately, which failures you expect and what you do when they happen:

```python
try:
    data = fetch_from_api(timeout=2.0)
except (TimeoutError, ConnectionError):
    data = last_known_good
process(data)
```

`back_end_resources/systems_primer/08_error_handling_fault_tolerance` is the hardware-flavored deep dive on this same idea. It discusses what your code does the instant a sensor disconnects mid-match, instead of trusting every reading it's ever handed.

## Budget Resources, Not Just Correctness

Even code that's correct and handles failure gracefully can still be wrong if it's too slow or too expensive to run under the conditions it actually faces. A control loop that must finish in 20 milliseconds has a budget, and that budget must be honored. `back_end_resources/systems_primer/01_concurrency_realtime_loops` covers the hardware version of a time budget in depth (the robot's 20ms periodic loop); `12_complexity_performance_intuition`, earlier in this folder, covers the sibling skill of noticing when your own code's growth is what's putting the budget at risk in the first place.

## Some Examples

**Hardware:** an arm mechanism moving to a setpoint needs a tolerance (it will never land on the exact target angle, floating-point sensor noise alone guarantees that), a timeout (if it hasn't arrived within some fixed time, something is physically wrong — stalled, jammed, disconnected — and waiting forever just holds the rest of the robot hostage), and a defined fallback (stop trying and raise a fault, rather than draw current into a stall indefinitely). This is `back_end_resources/systems_primer/04` and `08` applied together.

**Not hardware:** a scouting app pulling live match data from an external API (The Blue Alliance) mid-event needs the exact same three decisions, with nothing physical involved. It needs a tolerance for staleness ("data up to 2 minutes old is fine to display"), a way to survive a request that fails or hangs (the venue's wifi isn't very reliable), and a fallback (show the last successful pull, clearly marked as stale, instead of a blank screen or a crash). Nothing about this scenario is robot-specific — the same three decisions apply to any code calling any API you don't control.

## Putting it together

Open `examples/tba_sync/`. You see `sync_scores.py` polls `fake_tba_api.py` (a small, deterministic stand-in for a live API, no real network involved) for a team's live average scouting score, and gets both of this module's central bugs wrong at once: it never handles a failed call, and it waits for two floating-point values to become bit-for-bit identical before it considers itself done. Run it, read what happens, and fix it in `exercises/`.

## See also

- **`06_debugging_methodology`** — a bug is only a bug relative to a definition of correct; this module is about writing that definition down *before* something breaks, instead of reverse-engineering it afterward.
- **`07_testing_philosophy`** — a test suite for code with a tolerance and a timeout looks different from one for a pure function; asserting `result == expected` isn't the right shape once "expected" is itself a moving, approximate target.
- **`12_complexity_performance_intuition`** — the performance half of "budget your resources," in more depth.
- **`back_end_resources/systems_primer`** (`01`, `04`, `04b`, `08`) — the full, applied, hardware-flavored version of every idea in this module.
- **`14_building_with_intent`** — that module's production-vs-local section is where "assume external input can fail" becomes a question of which code needs that treatment at all, not just how to write the check.

## Resources

- [The Fallacies of Distributed Computing](https://en.wikipedia.org/wiki/Fallacies_of_distributed_computing) - a classic, short list of assumptions ("the network is reliable," "latency is zero") that this module's "treat external input as something that can fail" section is really just one instance of.
- [Python docs: Floating Point Arithmetic — Issues and Limitations](https://docs.python.org/3/tutorial/floatingpoint.html) - the official explanation of exactly why waiting for two floats to become bit-for-bit equal is a bad plan, in any language.
- [AWS Builders' Library: Timeouts, retries, and backoff with jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/) - a practical, widely-cited look at what to actually do once you've accepted that a call to something you don't control can fail.
