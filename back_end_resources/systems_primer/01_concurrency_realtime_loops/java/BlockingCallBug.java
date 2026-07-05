// 01 - Concurrency & Real-Time Loops: a blocking call stalling the loop
//
// Identical to PeriodicLoopDemo.java, except tick 8 calls
// simulateBlockingSensorRead(), which behaves like a slow, unresponsive
// sensor or network read: it blocks for far longer than the 20ms period
// allows. Everything else about the loop is unchanged.
//
// Compile and run directly, no dependencies:
//   $ javac BlockingCallBug.java
//   $ java BlockingCallBug
//
// Watch tick 8's printed timing: instead of finishing in a few milliseconds
// like every other tick, it blows straight through the 20ms budget. On a
// real robot, this is exactly what a WPILib "loop overrun" warning is
// reporting, and while it's blocked, EVERY subsystem is stalled with it,
// not just whichever one made the slow call.
public class BlockingCallBug {

    static final int PERIOD_MS = 20;
    static final int TOTAL_TICKS = 15;
    static final int BLOCKING_TICK = 8;

    public static void main(String[] args) throws InterruptedException {
        System.out.println("Simulating the same " + PERIOD_MS + "ms periodic loop, "
            + "but tick " + BLOCKING_TICK + " makes a blocking call...\n");

        for (int tick = 1; tick <= TOTAL_TICKS; tick++) {
            long tickStart = System.nanoTime();

            if (tick == BLOCKING_TICK) {
                simulateBlockingSensorRead();
            } else {
                fakeSubsystemWork(tick);
            }

            long workElapsedMs = (System.nanoTime() - tickStart) / 1_000_000;
            long remainingMs = PERIOD_MS - workElapsedMs;

            if (remainingMs < 0) {
                System.out.printf(
                    "tick %2d: work took %3dms -- OVERRUN by %dms! entire robot loop was stalled this whole time.%n",
                    tick, workElapsedMs, -remainingMs);
            } else {
                System.out.printf(
                    "tick %2d: work took %2dms, sleeping %2dms to hold the %dms period%n",
                    tick, workElapsedMs, remainingMs, PERIOD_MS);
                Thread.sleep(remainingMs);
            }
        }

        System.out.println("\nNotice tick " + BLOCKING_TICK + " is the only one that overran, but its "
            + "300ms stall happened to EVERY subsystem at once -- a drivetrain, an arm, and an intake "
            + "sharing this loop would all have frozen together, not just the one thing that was actually slow.");
    }

    // Before (see PeriodicLoopDemo.java): fast, bounded, local work.
    static void fakeSubsystemWork(int tick) {
        double angle = Math.sin(tick) * 90.0;
        double motorOutput = angle / 90.0;
        // (assert is a no-op unless run with `java -ea`; kept here just to document the invariant.)
        assert motorOutput >= -1.0 && motorOutput <= 1.0;
    }

    // After: the exact same kind of call a real robot might make -- e.g.
    // asking a coprocessor for a vision result, or reading a sensor over a
    // connection that's momentarily unresponsive -- except here it's forced
    // to take 300ms so the effect is impossible to miss. Thread.sleep() is
    // standing in for "any call that blocks"; a real slow network read would
    // stall the loop in exactly the same way, without a single line of code
    // that *looks* dangerous.
    static void simulateBlockingSensorRead() throws InterruptedException {
        Thread.sleep(300);
    }
}
