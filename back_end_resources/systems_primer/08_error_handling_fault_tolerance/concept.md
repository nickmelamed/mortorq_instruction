# 08 - Error Handling and Fault Tolerance

## A crash mid-match is worse than almost anywhere else

In most software, an uncaught exception is an inconvenience: a request fails, a user sees an error page, someone gets paged, it gets fixed. On a robot, mid-match, an uncaught exception in your periodic code can mean the whole robot program stops responding — no drivetrain, no arm, nothing — for the rest of that match, with no way to restart it in time to matter. That asymmetry is why this topic matters more here than in most contexts you'll write code in: **the cost of an unhandled failure isn't "annoying," it's "the match is over for you."**

## Real failure scenarios worth designing around

- **A sensor disconnects mid-match.** A wire jars loose, a device browns out. Code that assumes a sensor reading is always present and always valid will throw or silently misbehave the instant that assumption breaks.
- **A network call to a coprocessor times out.** The coprocessor is momentarily busy, or the connection hiccups. Code that just waits indefinitely for a response risks the exact blocking-call stall `01_concurrency_realtime_loops` warned about; code that assumes a response always arrives risks working with a `null` or garbage value if it doesn't.
- **A value comes back stale, missing, or out of range.** Not every failure is a hard crash — a sensor can also just report a number that's technically present but wrong (a stuck value, an out-of-range reading from a startup glitch).

None of these are exotic edge cases. On a physical machine with physical wiring, competing for time and attention with everything else your team is doing, they're closer to *expected* than exceptional.

## Defensive patterns

- **Null/bounds checks.** Before using a value, confirm it's actually there and actually reasonable, instead of assuming it. This is the cheapest and most common form of defense, and it belongs at every boundary where data enters your code from somewhere you don't fully control (a sensor, a network call, user/driver input).
- **Timeouts.** Never wait indefinitely for something that might not come back. A bounded wait — "give this at most 200ms, then move on" — turns an unbounded, robot-freezing stall into a small, predictable delay you can actually recover from.
- **Fallback behavior.** When a value can't be trusted (missing, stale, out of range), have a deliberate, safe default ready — the last known-good value, a conservative constant, a "do nothing safely" state — rather than letting a bad value propagate into a motor command, or letting an exception propagate up and take the whole program down with it.

The throughline across all three: **a failure should shrink to the smallest problem it can possibly be**, instead of being allowed to grow into "the whole robot stopped responding."

## Putting it together

`java/SensorFaultHandlingDemo.java` wraps a simulated sensor read (one that sometimes returns a stale or missing value, on purpose) with exactly this pattern: check whether the reading is fresh and present, and if it isn't, fall back to a safe default instead of letting a `null` or a stale value flow into whatever would have used it next.
