# Exercise 1: Close the Gap — Out-of-Range Isn't Handled Yet

## Goal
`concept.md` names three real failure scenarios — disconnected, stale, and **out of range** — but `SafeSensorReader.readSafely()` only actually guards against the first two. Find that gap yourself, then close it.

## Setup
Work in `08_error_handling_fault_tolerance/java/SensorFaultHandlingDemo.java`. Compile/run with:
```text
$ javac SensorFaultHandlingDemo.java
$ java SensorFaultHandlingDemo
```

## Steps
1. Read `readSafely()` closely and confirm: what does it currently check for, exactly? List the specific conditions. Does anything in the current code stop a *present, fresh* reading of, say, `999.0` degrees from passing straight through as if it were valid?
2. Add a new entry to the `script` array in `main()` with a present, fresh, but physically impossible value (an arm sensor reporting `999.0` degrees, timestamped correctly for its tick). Run the file and confirm your suspicion from step 1: does `999.0` get treated as trustworthy?
3. Add a bounds check to `SafeSensorReader`: a valid arm angle is `0.0` to `180.0` degrees. Any fresh, present reading outside that range should be treated exactly like a stale or missing one — fall back to `lastKnownGood`, and print a message saying why (reuse the style of the existing stale/missing messages).
4. Rerun with your new script entry in place and confirm the out-of-range value now gets rejected and the fallback fires.
5. One more case worth thinking through: what should happen if the *very first* reading in the whole script is the out-of-range one, before any good value has ever come in? Check what your bounds check actually does in that situation, and confirm it matches `SAFE_DEFAULT_DEGREES`'s existing role for the missing-value case.

## Self-Check
- [ ] I correctly identified, before making any changes, that out-of-range values pass through unchecked in the original file
- [ ] My added script entry is present and fresh (not null, not stale) but out of the 0-180 range
- [ ] My bounds check rejects it and falls back to `lastKnownGood`, with a printed message explaining why
- [ ] I checked and can state what happens when the very first reading is the out-of-range one

## Reflection
This is a realistic gap, not a made-up one: it's easy to write "check for null, check for stale" and feel like sensor failure is covered, when a sensor that's alive, responsive, and confidently reporting a wrong number is arguably the more dangerous failure of the three — nothing about it *looks* broken from the outside. A `999.0`-degree arm reading fed straight into a PID setpoint (`04_control_loops_pid`) wouldn't throw an exception or time out; it would just calculate a large error and drive the arm hard toward a target that was never real. Bounds-checking is what catches a sensor that's failing quietly, confidently, and exactly like a working one — right up until you check the number against what's physically possible.
