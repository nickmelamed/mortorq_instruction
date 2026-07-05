// 01 - Concurrency & Real-Time Loops: the periodic loop model
//
// This simulates the shape of WPILib's periodic loop (a fixed-rate `while`
// loop, ticking roughly every PERIOD_MS milliseconds) without any real
// robot hardware. On a real robot, WPILib's scheduler calls every
// Subsystem's periodic() and every running Command's execute() once per
// tick, automatically, for the whole match. Here, fakeSubsystemWork() stands
// in for all of that combined work.
//
// Compile and run directly, no dependencies:
//   $ javac PeriodicLoopDemo.java
//   $ java PeriodicLoopDemo
//
// Compare this file's output against BlockingCallBug.java's: same loop
// structure, but that one deliberately breaks the timing on one tick.
public class PeriodicLoopDemo {

    static final int PERIOD_MS = 20;   // WPILib's real default loop period
    static final int TOTAL_TICKS = 15; // a real match runs ~7500 of these; 15 is enough to see the pattern

    public static void main(String[] args) throws InterruptedException {
        System.out.println("Simulating a " + PERIOD_MS + "ms periodic loop for " + TOTAL_TICKS + " ticks...\n");

        for (int tick = 1; tick <= TOTAL_TICKS; tick++) {
            long tickStart = System.nanoTime();

            fakeSubsystemWork(tick);

            long workElapsedMs = (System.nanoTime() - tickStart) / 1_000_000;
            long remainingMs = PERIOD_MS - workElapsedMs;

            System.out.printf(
                "tick %2d: work took %2dms, sleeping %2dms to hold the %dms period%n",
                tick, workElapsedMs, Math.max(remainingMs, 0), PERIOD_MS);

            // This is the part a real robot loop does for you automatically:
            // wait out whatever time is left in the period before the next
            // tick starts, so ticks happen at a steady, predictable rate
            // rather than back-to-back as fast as the CPU can go.
            if (remainingMs > 0) {
                Thread.sleep(remainingMs);
            }
        }

        System.out.println("\nDone. Every tick finished well inside the " + PERIOD_MS + "ms budget -- "
            + "see BlockingCallBug.java for what happens when one doesn't.");
    }

    // Stand-in for "everything that runs on the robot's main loop": reading
    // sensors, running subsystem periodic() methods, deciding motor outputs.
    // Deliberately fast and bounded, like well-behaved robot code should be.
    static void fakeSubsystemWork(int tick) {
        double angle = Math.sin(tick) * 90.0; // pretend this is a sensor reading
        double motorOutput = angle / 90.0;    // pretend this is a simple proportional response
        // No sleeping, no network calls, no unbounded loops -- just fast, local math.
        // (motorOutput is computed only to show a realistic "read -> decide" shape; nothing
        // reads it further in this demo.)
        // (assert is a no-op unless run with `java -ea`; kept here just to document the invariant.)
        assert motorOutput >= -1.0 && motorOutput <= 1.0;
    }
}
