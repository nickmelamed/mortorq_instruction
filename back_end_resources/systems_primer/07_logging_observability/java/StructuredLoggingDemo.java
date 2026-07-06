// 07 - Logging & Observability: structured logs for the 03 state machine
//
// StructuredLogger gives every log line the same consistent shape (
// timestamp, level, message, relevant state) instead of a scattered
// System.out.println. It's attached below to AutonomousStateMachine's
// transition listener (03_state_machines/java/AutonomousStateMachine.java,
// the same class 06_testing_debugging unit-tested), so every state
// transition produces one structured line instead of relying on that
// class's own plain prints as the only record of what happened.
//
// Compile and run (this imports 03's file directly, same as 06's demos):
//   $ javac -d bin StructuredLoggingDemo.java ../../03_state_machines/java/AutonomousStateMachine.java
//   $ java -cp bin StructuredLoggingDemo
import java.time.Instant;

public class StructuredLoggingDemo {

    enum Level {
        INFO,
        WARN,
        ERROR
    }

    static class StructuredLogger {
        // key/value pairs, alternating key, value, key, value... so a single
        // varargs call can attach as many relevant fields as an event needs.
        void log(Level level, String message, Object... keyValuePairs) {
            StringBuilder line = new StringBuilder();
            line.append(Instant.now()).append(" ")
                .append(String.format("%-5s", level)).append(" ")
                .append(message);

            for (int i = 0; i + 1 < keyValuePairs.length; i += 2) {
                line.append(" ").append(keyValuePairs[i]).append("=").append(keyValuePairs[i + 1]);
            }

            System.out.println(line);
        }
    }

    public static void main(String[] args) {
        StructuredLogger logger = new StructuredLogger();

        // A quick look at all three levels before the real demo, so you can
        // see the consistent shape isn't specific to just one of them.
        logger.log(Level.INFO, "logger initialized");
        logger.log(Level.WARN, "example: sensor reading is stale", "sensor", "armEncoder", "ageMs", 150);
        logger.log(Level.ERROR, "example: lost connection to coprocessor", "attempts", 3);
        System.out.println();

        AutonomousStateMachine autonomous = new AutonomousStateMachine();
        int[] tick = {0};

        // Every transition now produces one structured line: timestamp,
        // level, message, and exactly the fields that matter (which tick,
        // which states), instead of AutonomousStateMachine's own
        // System.out.println calls being the only record of what happened.
        autonomous.addTransitionListener((from, to) ->
            logger.log(Level.INFO, "state transition", "tick", tick[0], "from", from, "to", to));

        System.out.println("Running the autonomous routine with structured logging attached:\n");
        for (tick[0] = 1; tick[0] <= 14; tick[0]++) {
            autonomous.periodic();
        }

        System.out.println();
        if (autonomous.getState() == AutonomousStateMachine.State.IDLE) {
            logger.log(Level.INFO, "autonomous routine completed", "finalState", autonomous.getState());
        } else {
            logger.log(Level.ERROR, "autonomous routine did not reach IDLE", "finalState", autonomous.getState());
        }

        System.out.println(
            "\nCompare this output to 03_state_machines/java/AutonomousStateMachine.java's own "
            + "plain println output: every event here has the same shape, so a real log viewer "
            + "(or even a text search) could filter to just 'state transition' lines, or just ERRORs, "
            + "after the fact -- something a wall of unstructured prints doesn't support.");
    }
}
