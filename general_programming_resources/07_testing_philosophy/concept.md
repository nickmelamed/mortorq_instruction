# 07 - Testing Philosophy

## This module teaches the "why," not a framework

`systems_primer/06_testing_debugging` teaches JUnit and WPILib simulation testing; the frontend equivalent is reserved for `frontend_systems_primer/07_testing`. Neither of those explains *what makes a test worth having in the first place* — that's this module's job, and it's the same thinking regardless of which framework (JUnit, pytest, Jest, anything else) ends up running the test.

## The test pyramid

Not all tests are the same shape, and a healthy test suite has more of some kinds than others:

- **Unit tests** — call one small, specific piece of code directly (a single function or class) with no real dependencies involved. Fast (milliseconds), narrow, and you should have *many* of them — this is the base of the pyramid.
- **Integration tests** — check that several pieces work correctly *together* (a function that reads a file and the parser that processes what it read; a component and the API client it calls). Slower than unit tests, and you need fewer of them.
- **End-to-end (e2e) tests** — exercise the entire system the way a real user would (open the app, click through a real flow, confirm the right thing ends up on screen). Slowest, most realistic, and you need the fewest of these — they're expensive to write, slow to run, and the first to break for reasons that have nothing to do with the thing you actually meant to test.

The "pyramid" shape is the point: many fast, narrow unit tests; fewer, slower integration tests; a handful of e2e tests confirming the whole system actually works end to end. A test suite shaped like an upside-down pyramid — mostly slow e2e tests, barely any unit tests — is a common real-world mistake: it's slow to run, painful to debug (a failure tells you almost nothing about *where* things broke), and gets skipped or ignored the moment it starts taking too long.

## What makes a test good vs. brittle

A good test is:

- **Deterministic** — the same code, run the same way, always produces the same result. A test that sometimes passes and sometimes fails with no code changes in between (a **flaky test**) is worse than no test at all, because it trains everyone to ignore failures instead of investigating them.
- **Focused** — it tests one behavior and fails for exactly one reason. A test that checks five unrelated things at once tells you *that* something broke, not *what*.
- **Independent** — it doesn't depend on other tests having run first, in a specific order, or on any state left behind by anything else. Tests that only pass in one specific order are a sign something is being shared that shouldn't be.
- **Fast enough to actually run often.** A test suite people avoid running because it's slow provides approximately zero value.

A **brittle** test violates one of these — usually by depending on something it has no business depending on: the real current time, real network access, unseeded randomness, shared mutable state, or the exact internal implementation of the code under test (so it breaks the moment you refactor, even though behavior didn't actually change).

## TDD: a tool, not a religion

**Test-driven development** means writing a failing test *before* writing the code that satisfies it, then writing the minimum code to make it pass, then cleaning up (the "red, green, refactor" cycle). Done well, it forces you to think clearly about what a function should actually do before you write it, and gives you instant, concrete confirmation the moment it does. It is not, however, a rule you're obligated to follow on everything: exploratory work, quick prototypes, and UI you're still figuring out by eye are all cases where writing the test first adds friction without adding much value, because you don't yet know what "correct" even looks like. Treat TDD as a tool you reach for deliberately — often for a function with a clear, specifiable contract — not a dogma you apply uniformly whether or not it's actually helping.

## Mocking: a stand-in, not a substitute for reality

A **mock** (or stub, or fake — related ideas, same underlying purpose) is a fake version of something your code depends on, used so a test can run in isolation, fast and deterministically, without a real network call, a real database, or real hardware. Mocking a sensor reading so a unit test can check your decision logic without a physical robot is a great use of the idea — it's exactly why `systems_primer/06_testing_debugging`'s simulation testing exists. The risk is over-mocking: if you mock so much that your test is really just checking that your mock returns what you told it to return, you've tested your assumptions about the dependency, not your actual code's behavior against it. A mock is only as useful as how faithfully it represents the real thing it's standing in for.

## When *not* to test something

Tests aren't free — every test is code you have to write, read, and maintain, same as any other code. It's a legitimate call to skip testing: a one-off script you'll run once and never again, trivial glue code with no real logic in it (a function that just calls another function and returns its result), or something that changes so often the test would need constant rewriting to keep up and would mostly just be testing your ability to keep tests in sync. The judgment call is the same shape as `05_dependency_management`'s "should this be a dependency at all": weigh what the test actually buys you against the ongoing cost of having it, instead of reflexively testing everything, or nothing.

## Putting it together

Open `examples/flaky_test/` — two tests that individually look completely reasonable, and that "sometimes fail" in a way that has nothing to do with a bug in the code they're testing. Run `run_tests.py` in both the given order and the reversed order (`python3 run_tests.py reversed`) and see for yourself before moving to `exercises/`.

## See also

- **`systems_primer/06_testing_debugging`** — the real, applied JUnit and WPILib simulation-testing mechanics this module deliberately doesn't re-teach.
- **`frontend_systems_primer/07_testing`** — the frontend equivalent, reserved for the frontend testing framework itself (this directory exists but isn't built yet).
- **`06_debugging_methodology`** — a good test suite is frequently what tells you a bug exists in the first place.
- **`05_dependency_management`** — the "is this worth having at all" judgment call this module's "when not to test" section borrows directly.

## Resources

- [Martin Fowler: TestPyramid](https://martinfowler.com/bliki/TestPyramid.html) - the original writeup of the shape this module opens with (already linked as further reading in `systems_primer/06_testing_debugging`; this module is where it's actually taught in full).
- [Martin Fowler: Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html) - a deeper look at the different flavors of test doubles, beyond this module's summary.
- [Google Testing Blog: Flaky Tests](https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html) - how flaky tests show up (and get dealt with) at real scale, far beyond this module's one example.
