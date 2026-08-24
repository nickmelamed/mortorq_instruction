# 07 - Testing Philosophy

## The Why, not the Framework

`back_end_resources/systems_primer/06_testing_debugging` teaches JUnit and WPILib simulation testing; the frontend equivalent is reserved for `front_end_resources/frontend_systems_primer/07_testing`. This module is meant to explain why testing matters, for any programming task. 

## The test pyramid

Not all tests are the same shape, and a healthy test suite has more of some kinds than others:

- **Unit tests** — call one small, specific piece of code directly (a single function or class) with no real dependencies involved. Fast (milliseconds), narrow, and you should have *many* of them. Think of this as the base of the pyramid.
- **Integration tests** — check that several pieces work correctly *together* (a function that reads a file and the parser that processes what it read; a component and the API client it calls). Slower than unit tests, and you need fewer of them.
- **End-to-end (e2e) tests** — exercise the entire system the way a real user would (open the app, click through a real flow, confirm the right thing ends up on screen). Slowest, most realistic, and you need the fewest of these. They're expensive to write, slow to run, and the first to break for a multitude of reasons. 

The "pyramid" shape is the point: many fast, narrow unit tests; fewer, slower integration tests; a handful of e2e tests confirming the whole system actually works end to end.

```text
            ┌──────────┐
            │   E2E    │  a handful — slow, realistic, expensive
       ┌────┴──────────┴────┐
       │    Integration     │  fewer — slower, checks pieces together
┌──────┴────────────────────┴──────┐
│            Unit Tests            │  many — fast, narrow, cheap; the base
└──────────────────────────────────┘
```

A test suite shaped like an upside-down pyramid — mostly slow e2e tests, barely any unit tests — is a common real-world mistake, sometimes called an **ice-cream-cone anti-pattern**:

```text
┌──────────────────────────────────┐
│               E2E                │  mostly — slow, brittle, expensive to maintain
└──────┬────────────────────┬──────┘
       │    Integration     │  some — still slower than they need to be
       └────┬──────────┬────┘
            │   Unit   │  barely any — the fast, cheap tests are missing
            └──────────┘
```

It's slow to run, painful to debug (a failure tells you almost nothing about *where* things broke), and gets skipped or ignored the moment it starts taking too long.

## What makes a test good vs. brittle

A good test is:

- **Deterministic** — the same code, run the same way, always produces the same result. A test that sometimes passes and sometimes fails with no code changes in between (a **flaky test**) is worse than no test at all, because it trains everyone to ignore failures instead of investigating them. As an aside, the **probabilistic** nature of LLMs is what makes their outputs harder to debug; you can't count on it giving you the same output for every entry of the same inputs. 
- **Focused** — it tests one behavior and fails for exactly one reason. A test that checks five unrelated things at once tells you that something broke, but never what specifically broke. 
- **Independent** — it doesn't depend on other tests having run first, in a specific order, or on any state left behind by anything else. Tests that only pass in one specific order are a sign something is being shared that shouldn't be.
- **Fast enough to actually run often.** A test suite people avoid running because it's slow provides very little value. 

A **brittle** test violates (at least) one of these. 

## Code Coverage Isn't the Goal

**Code coverage** is the percentage of your code's lines (or branches) that get executed at least once while your test suite runs. It's a useful *signal* — a function sitting at 0% coverage definitely has zero tests, which is worth knowing — but it's a textbook example of `14_building_with_intent`'s vanity-metric warning. A number that's easy to move without moving the thing you actually care about. A test can execute every line of a function and check nothing meaningful about what any of those lines actually produced:

```python
def compute_bonus(points):
    if points > 20:
        return 5
    return 0

# 100% line coverage, catches nothing:
def test_compute_bonus_runs():
    compute_bonus(25)  # hits the "return 5" branch
    compute_bonus(10)  # hits the "return 0" branch
    # neither return value is ever checked
```

That test hits every line inside `compute_bonus`, both branches included — 100% coverage — and would pass identically if the function were rewritten to always return `None`. Coverage can tell you a line was executed, but nothing about verification of what happened. Treat a low number as a real signal something's undertested, and a high number as no signal at all about whether the tests are any good.

## TDD

**Test-driven development** means writing a failing test *before* writing the code that satisfies it, then writing the minimum code to make it pass, then cleaning up (the "red, green, refactor" cycle). Done well, it forces you to think clearly about what a function should actually do before you write it, and gives you instant, concrete confirmation the moment it does. It is not, however, a rule you're obligated to follow on everything. Exploratory work, quick prototypes, and UI you're still figuring out by eye are all cases where writing the test first adds friction without adding much value, because you don't yet know what "correct" even looks like. Treat TDD as a tool you reach for deliberately — often for a function with a clear, specifiable contract — not a dogma you apply uniformly whether or not it's actually helping.

## Mocking

A **mock** (or stub/fake) is a fake version of something your code depends on, used so a test can run in isolation, fast and deterministically, without a real network call, a real database, or real hardware. Mocking a sensor reading so a unit test can check your decision logic without a physical robot is a great use of the idea; it's exactly why `back_end_resources/systems_primer/06_testing_debugging`'s simulation testing exists. The risk is over-mocking, because while testing your code out on simulated versions is great, things go wrong in real-world applications, and your code needs to be used on those. A mock is only as useful as how faithfully it represents the real thing it's standing in for, and spoiler alert, almost no mock will ever match what goes wrong with the real thing. 

## When not to Test? 

Tests aren't free, because like other code, you still have to plan, write, and maintain them. It's a legitimate call to skip testing! One-off scripts that you'll never use again, trivial code, or code that constantly changes are probably not the best candidates for testing. The judgment call is the same shape as `05_dependency_management`'s "should this be a dependency at all": weigh what the test actually buys you against the ongoing cost of having it, instead of reflexively testing everything, or nothing.

## Putting it together

Open `examples/flaky_test/`; there are two tests that individually look completely reasonable, and that "sometimes fail" in a way that has nothing to do with a bug in the code they're testing. Run `run_tests.py` in both the given order and the reversed order (`python3 run_tests.py reversed`) and see for yourself before moving to `exercises/exercise-1-fix-the-flaky-test.md`.

Three more exercises pick up the rest of this module, each one hands-on rather than descriptive: `exercise-2-tdd-the-rating-function.md` builds a function entirely through red-green-refactor, one test at a time; `exercise-3-mock-fidelity.md` uses `examples/mocking_fidelity/` to watch the exact same test catch a real bug with one mock and miss it completely with another; `exercise-4-rebuild-the-pyramid.md` uses `examples/pyramid_shape/` to measure the pyramid shape's actual payoff — real timing, real failure-message specificity — instead of just recognizing the shape from a diagram.

## See also

- **`back_end_resources/systems_primer/06_testing_debugging`** — the real, applied JUnit and WPILib simulation-testing mechanics this module deliberately doesn't re-teach.
- **`front_end_resources/frontend_systems_primer/07_testing`** — the frontend equivalent, reserved for the frontend testing framework itself (this directory exists but isn't built yet).
- **`06_debugging_methodology`** — a good test suite is frequently what tells you a bug exists in the first place.
- **`05_dependency_management`** — the "is this worth having at all" judgment call this module's "when not to test" section borrows directly.
- **`14_building_with_intent`** — the same "is this worth the effort" judgment call, generalized from testing specifically to engineering effort as a whole; and code coverage is one of that module's vanity-metric warnings playing out concretely, in this module's own territory.

## Resources

- [Martin Fowler: TestPyramid](https://martinfowler.com/bliki/TestPyramid.html) - the original writeup of the shape this module opens with (already linked as further reading in `back_end_resources/systems_primer/06_testing_debugging`; this module is where it's actually taught in full).
- [Martin Fowler: Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html) - a deeper look at the different flavors of test doubles, beyond this module's summary.
- [Google Testing Blog: Flaky Tests](https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html) - how flaky tests show up (and get dealt with) at real scale, far beyond this module's one example.
- [Martin Fowler: TestCoverage](https://martinfowler.com/bliki/TestCoverage.html) - Fowler's own take on exactly this module's coverage warning, including his suspicion of anyone reporting suspiciously round, high numbers.
