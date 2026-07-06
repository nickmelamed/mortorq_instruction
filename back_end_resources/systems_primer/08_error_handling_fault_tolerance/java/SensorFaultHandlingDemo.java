// 08 - Error Handling & Fault Tolerance: a sensor read with a safe fallback
//
// The scripted SensorReading[] in main() simulates exactly the failure
// scenarios concept.md describes: a disconnect (a missing reading) and a
// stale reading (present, but too old to trust). SafeSensorReader wraps
// those raw readings with a bounds/freshness check and a fallback to the
// last known-good value, instead of letting a null or stale value flow
// straight through to whatever would use it next (in a real system: a motor
// command).
//
// Compile and run directly, no dependencies:
//   $ javac SensorFaultHandlingDemo.java
//   $ java SensorFaultHandlingDemo
public class SensorFaultHandlingDemo {

    // One raw sensor reading. value == null means "sensor disconnected, no
    // reading at all". distinct from a present-but-stale value.
    static class SensorReading {
        final Double value;
        final long timestampMs;

        SensorReading(Double value, long timestampMs) {
            this.value = value;
            this.timestampMs = timestampMs;
        }
    }

    // Wraps raw sensor readings with the defensive pattern concept.md
    // describes: check presence, check freshness, fall back to the last
    // known-good value (or a safe default, if nothing's ever been good yet)
    // rather than letting a bad value propagate.
    static class SafeSensorReader {
        private static final long MAX_AGE_MS = 100;
        private static final double SAFE_DEFAULT_DEGREES = 0.0;

        private double lastKnownGood = SAFE_DEFAULT_DEGREES;

        double readSafely(SensorReading reading, long nowMs) {
            if (reading.value == null) {
                System.out.println("    -> sensor reported no value (disconnected); "
                    + "falling back to last known-good value: " + lastKnownGood);
                return lastKnownGood;
            }

            long ageMs = nowMs - reading.timestampMs;
            if (ageMs > MAX_AGE_MS) {
                System.out.println("    -> reading is " + ageMs + "ms old (stale, over " + MAX_AGE_MS
                    + "ms threshold); falling back to last known-good value: " + lastKnownGood);
                return lastKnownGood;
            }

            lastKnownGood = reading.value;
            return reading.value;
        }
    }

    public static void main(String[] args) {
        SafeSensorReader safeReader = new SafeSensorReader();

        long tickPeriodMs = 20; // matches 01_concurrency_realtime_loops's period
        long now = 0;

        // A scripted sequence of raw readings: DISCONNECTED (before any good
        // reading has ever come in), normal, normal, normal, DISCONNECTED
        // (this time with a last known-good value to fall back on), STALE,
        // then back to normal. A real sensor would produce these
        // unpredictably; scripting them here keeps the demo reproducible and
        // lets every failure mode (including the "nothing's ever been
        // good yet" one) show up on purpose.
        SensorReading[] script = {
            new SensorReading(null, 0),          // disconnected from the very first tick: no last known-good value exists yet
            new SensorReading(45.0, 20),
            new SensorReading(46.2, 40),
            new SensorReading(47.0, 60),
            new SensorReading(null, 80),         // disconnected: no value at all
            new SensorReading(47.0, -160),        // stale: present, but far too old to trust
            new SensorReading(48.5, 120),
            new SensorReading(49.0, 140),
        };

        System.out.println("Reading a simulated arm-angle sensor across 8 ticks, with a "
            + "disconnect on tick 1 (before any good reading exists), a second disconnect on "
            + "tick 5, and a stale reading on tick 6:\n");

        for (int tick = 0; tick < script.length; tick++) {
            now = tick * tickPeriodMs;
            SensorReading raw = script[tick];

            String rawDescription = (raw.value == null) ? "MISSING" : String.format("%.1f", raw.value);
            System.out.printf("tick %d (t=%3dms): raw reading = %s%n", tick + 1, now, rawDescription);

            double safeValue = safeReader.readSafely(raw, now);
            System.out.printf("    -> value used by the rest of the robot: %.1f%n", safeValue);
        }

        System.out.println("\nNotice the robot never saw a null or a wildly stale value reach the "
            + "code that actually acts on it -- every failure shrank down to \"reuse the last good "
            + "reading\" instead of propagating further. Tick 1 is the one case with no last "
            + "known-good value to fall back on yet, which is exactly what SAFE_DEFAULT_DEGREES is for.");
    }
}
