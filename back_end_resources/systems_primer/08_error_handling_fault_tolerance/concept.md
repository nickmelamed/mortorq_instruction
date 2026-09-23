# 08 - Error Handling and Fault Tolerance

## Crashing Mid-Match

A robot that crashes mid-match doesn't get to recover. It just sits there, doing nothing, in front of the judges and the other alliance, for the rest of the match. Catching errors before they reach that point is the entire point of this topic.

## Real Failure Scenarios 

- **A sensor disconnects mid-match.** Code that assumes a sensor reading is always present and always valid will throw or silently misbehave the instant that assumption breaks.
- **A network call to a coprocessor times out.** The coprocessor is momentarily busy, or the connection hiccups. Code that just waits indefinitely for a response risks the exact blocking-call stall `01_concurrency_realtime_loops` warned about; code that assumes a response always arrives risks working with a `null` or garbage value if it doesn't.
- **A value comes back stale, missing, or out of range.** Not every failure is a hard crash: a sensor can also just report a number that's technically present but wrong.

None of these are exotic edge cases! You'll almost certainly see them during matches, and hopefully after this unit, it won't be for our robot. 

They're exactly what `frc_resources/07_hardware_debugging`'s Tuner X / REV Hardware Client fault flags ("hardware fault," "undervoltage," "boot during enable") are built to surface on real hardware. This unit teaches how your code should react once one of these happens; `07_hardware_debugging` covers how you'd actually see it happening in the pit.

## Defensive Patterns

Defensive patterns are steps you can take to make sure the failures above don't take the whole robot down with them.

- **Null/bounds checks.** Before using a value, confirm it's actually there and actually reasonable, instead of assuming it. This is the cheapest and most common form of defense, and it belongs at every boundary where data enters your code from somewhere you don't fully control (a sensor, a network call, user/driver input).
- **Timeouts.** Never wait indefinitely for something that might not come back. A bounded wait — "give this at most 200ms, then move on" — turns an unbounded, robot-freezing stall into a small, predictable delay you can actually recover from.
- **Fallback behavior.** When a value can't be trusted (missing, stale, out of range), have a deliberate, safe default ready (the last known-good value, a conservative constant, a "do nothing safely" state) rather than letting a bad value propagate into a motor command, or letting an exception propagate up and take the whole program down with it.

The throughline across all three: a failure in one piece of data shouldn't mean the whole robot stops working.

That throughline has a limit, though. Falling back and continuing is the right call for a value that's merely unreliable, but not every fault should be papered over this way. If a mechanism's own sensor data can no longer be trusted at all (not just briefly stale, but persistently missing or nonsensical), continuing to act on a guessed fallback can be worse than just stopping. The safer move at that point is disabling that one subsystem outright. This is the same choice `frc_resources/02_driver_station` describes for a human pressing E-Stop or A-Stop, just made in code, one subsystem at a time, instead of by a driver stopping the whole robot.

## Handling a Fault isn't the same as Recording It 

Falling back to a safe value the moment a sensor misbehaves solves the issue of it crashing during a match. It doesn't, on its own, solve a different problem `07_logging_observability` already raised: finding out afterward that it happened at all. A fallback that fires silently and successfully is easy to miss entirely until it happens at the worst possible moment during a match.

The bridge between the two is WPILib's `DriverStation.reportError(String, boolean)` and `DriverStation.reportWarning(String, boolean)`. These are calls that write straight into the same driver station log `07` described, the one place you're guaranteed to be able to check after a match. A real version of `SafeSensorReader` would call `DriverStation.reportWarning(...)` at the exact point this unit's demo just prints a fallback message, so "this sensor was stale and we fell back to the last known-good value" isn't only visible in the moment the code runs; it's still there to find during a post-mortem, exactly the throughline `07` built its whole topic around.

## Putting it together

`java/SensorFaultHandlingDemo.java` wraps a simulated sensor read (one that sometimes returns a stale or missing value, on purpose) with exactly this pattern: check whether the reading is fresh and present, and if it isn't, fall back to a safe default instead of letting a `null` or a stale value flow into whatever would have used it next.

## Resources

- [DriverStation (WPILib API)](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/wpilibj/DriverStation.html) - the real class behind `reportError`/`reportWarning`, referenced above.
- [Martin Fowler: Circuit Breaker](https://martinfowler.com/bliki/CircuitBreaker.html) - a related fault-tolerance pattern for a different failure shape: stop calling something that's already failing, instead of retrying it forever.
- [Wikipedia: Defensive programming](https://en.wikipedia.org/wiki/Defensive_programming) - the general discipline this unit's null/bounds checks, timeouts, and fallback behavior are all specific instances of.
