# Exercise 3: Mock Fidelity

## Goal
Watch a real bug get caught by one mock and missed by another, using the exact same test and the exact same buggy code.

## Scenario
`examples/mocking_fidelity/intake.py` has one function, `should_retract_intake(sensor)`, documented to retract "once the game piece sensor reads 0.9 or higher." `sensors.py` has two fake sensors: `FaithfulSensor`, which returns exactly `0.9` (a real sensor settling right at a documented boundary, the way real sensors actually do), and `UnfaithfulSensor`, which always returns a clean `1.0`. `test_intake.py` has one test for each.

## Steps
1. Run `python3 test_intake.py` and record which test passes and which fails.
   
2. Open `intake.py` and find the exact comparison responsible. Does it match the docstring's promise ("0.9 or higher")?
   
3. Explain, in one sentence, why `test_with_faithful_mock` catches the bug and `test_with_unfaithful_mock` doesn't, even though both tests assert the exact same thing against the exact same function.
   
4. Fix the bug in `intake.py` so it actually matches the documented behavior.
   
5. Re-run `test_intake.py` and confirm both tests now pass.
   
6. Now break it the other way: temporarily change `UnfaithfulSensor.read()` to return `0.5` (a clean, comfortably-below-threshold value) instead of `1.0`. Would a test written only against this version have ever caught *either* direction of this bug? Explain why or why not, then revert your change.

## Self-Check
- [ ] I can state which test passed and which failed on the original, buggy `intake.py`
- [ ] I identified the exact comparison operator responsible for the mismatch with the docstring
- [ ] I can explain in one sentence why mock fidelity, not test correctness, was the deciding factor
- [ ] Both tests pass after fixing `intake.py`
- [ ] I can explain why a test built only around `UnfaithfulSensor` (in either version) would never have caught this bug at all

## Reflection
`test_with_unfaithful_mock` isn't a bad test because it's *wrong*. Its assertion is completely correct, and it passed for a real reason. It's a bad test because `UnfaithfulSensor` never produces the one value where this bug actually lives. A mock that's easier to write because it avoids exactly the edge cases real hardware actually hits isn't saving you work. The fidelity of the mock *is* the test's coverage, in a way the test's own assertions can't make up for.
