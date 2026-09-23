// 10 - Capstone: one system, several patterns at once
//
// A simulated endgame climber arm that needs to raise to a target angle and
// hold it there. It is built from every pattern this primer covered, wired
// together instead of demonstrated in isolation:
//
//   01 (periodic loop)   -- main() drives ClimberStateMachine.periodic() in a
//                            fixed-rate tick loop, exactly the shape every
//                            other demo in this primer has used.
//   03 (state machines)  -- RAISING -> HOLDING -> IDLE, the same enum +
//                            transition-listener shape as
//                            AutonomousStateMachine.java, except transitions
//                            are driven by whether the arm has actually
//                            converged, not a fixed tick countdown.
//   04 (PID)             -- SimplePIDController (identical to
//                            PidLoopDemo.java's) drives the arm toward its
//                            setpoint during RAISING and holds it there
//                            during HOLDING.
//   07 (structured logging) -- every state transition and every sensor fault
//                            produces one StructuredLogger line, the same
//                            shape as StructuredLoggingDemo.java.
//   08 (fault tolerance) -- SafeSensorReader wraps the arm's angle sensor;
//                            a scripted disconnect and a scripted stale
//                            reading both fall back to the last known-good
//                            value instead of feeding a bad number into PID.
//   09 (configuration)   -- Constants.ACTIVE_PROFILE switches PID gains
//                            between a PRACTICE_BOT and COMP_BOT profile,
//                            the same pattern as Constants.java.
//
// Compile and run directly, no dependencies:
//   $ javac CapstoneRobot.java
//   $ java CapstoneRobot
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.function.BiConsumer;

public class CapstoneRobot {

    // 09: centralized, profile-aware configuration 
    static final class Constants {
        private Constants() {}

        enum RobotProfile { PRACTICE_BOT, COMP_BOT }

        static final RobotProfile ACTIVE_PROFILE = RobotProfile.COMP_BOT;

        static final double SETPOINT_DEGREES = 90.0;

        // Same profile-switch shape as 09_configuration_constants_management's
        // Constants.java: the practice bot's arm doesn't respond identically
        // to the competition bot's, even running the same code.
        static final double KP = (ACTIVE_PROFILE == RobotProfile.COMP_BOT) ? 0.060 : 0.045;
        static final double KI = 0.020;
        static final double KD = 0.006;

        static final double ARRIVAL_TOLERANCE_DEGREES = 1.0;
        static final int TICKS_TO_CONFIRM_ARRIVAL = 5; // must hold inside tolerance, not just touch it once
        static final int HOLD_TICKS = 50; // ~1s simulated, once holding

        static final long SENSOR_MAX_AGE_MS = 100;
        static final double SAFE_DEFAULT_DEGREES = 0.0;

        static final double DT_SECONDS = 0.02; // matches 01_concurrency_realtime_loops's 20ms period
    }

    // 07: structured logging
    enum Level { INFO, WARN, ERROR }

    static final class StructuredLogger {
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

    // 04: PID controller (same shape as PidLoopDemo.java)
    static final class SimplePIDController {
        private static final double MAX_INTEGRAL = 5.0;

        private final double kP, kI, kD;
        private double integral = 0.0;
        private double previousError = 0.0;
        private boolean hasPreviousError = false;

        SimplePIDController(double kP, double kI, double kD) {
            this.kP = kP;
            this.kI = kI;
            this.kD = kD;
        }

        double calculate(double measurement, double setpoint, double dtSeconds) {
            double error = setpoint - measurement;

            integral += error * dtSeconds;
            integral = Math.max(-MAX_INTEGRAL, Math.min(MAX_INTEGRAL, integral));

            double derivative = 0.0;
            if (hasPreviousError) {
                derivative = (error - previousError) / dtSeconds;
            }
            previousError = error;
            hasPreviousError = true;

            return (kP * error) + (kI * integral) + (kD * derivative);
        }
    }

    // simulated hardware 
    static final class SimulatedArm {
        private double angleDegrees = 0.0;

        void applyOutput(double output) {
            double clamped = Math.max(-1.0, Math.min(1.0, output));
            angleDegrees += clamped * 3.0; // 3 degrees per tick at full output, same as PidLoopDemo.java
        }

        double getAngleDegrees() {
            return angleDegrees;
        }
    }

    // 08: fault-tolerant sensor wrapper (same pattern as SensorFaultHandlingDemo.java)
    static final class SensorReading {
        final Double value;
        final long timestampMs;

        SensorReading(Double value, long timestampMs) {
            this.value = value;
            this.timestampMs = timestampMs;
        }
    }

    static final class SafeSensorReader {
        private final StructuredLogger logger;
        private double lastKnownGood = Constants.SAFE_DEFAULT_DEGREES;

        SafeSensorReader(StructuredLogger logger) {
            this.logger = logger;
        }

        double readSafely(SensorReading reading, long nowMs) {
            if (reading.value == null) {
                logger.log(Level.WARN, "climber arm sensor reported no value; falling back to last known-good",
                    "lastKnownGoodDegrees", lastKnownGood);
                return lastKnownGood;
            }

            long ageMs = nowMs - reading.timestampMs;
            if (ageMs > Constants.SENSOR_MAX_AGE_MS) {
                logger.log(Level.WARN, "climber arm sensor reading stale; falling back to last known-good",
                    "ageMs", ageMs, "lastKnownGoodDegrees", lastKnownGood);
                return lastKnownGood;
            }

            lastKnownGood = reading.value;
            return reading.value;
        }
    }

    // 03: state machine, PID-driven instead of tick-driven
    enum State { RAISING, HOLDING, IDLE }

    // Unlike AutonomousStateMachine.java (03_state_machines), which transitions on a fixed
    // tick countdown standing in for a sensor, RAISING here transitions on a real convergence
    // check against the PID loop's own error. So, the state machine and the control loop are
    // reading from the same measurement, not running as two unrelated systems.
    static final class ClimberStateMachine {
        private final SimplePIDController pid;
        private final SimulatedArm arm;
        private final SafeSensorReader sensor;
        private final List<BiConsumer<State, State>> transitionListeners = new ArrayList<>();

        private State currentState = State.RAISING;
        private int ticksInState = 0;
        private int ticksWithinTolerance = 0;

        ClimberStateMachine(SimplePIDController pid, SimulatedArm arm, SafeSensorReader sensor) {
            this.pid = pid;
            this.arm = arm;
            this.sensor = sensor;
        }

        State getState() {
            return currentState;
        }

        void addTransitionListener(BiConsumer<State, State> listener) {
            transitionListeners.add(listener);
        }

        // Call this once per tick, exactly like every periodic() elsewhere in this primer.
        void periodic(SensorReading rawReading, long nowMs) {
            ticksInState++;
            double measuredAngle = sensor.readSafely(rawReading, nowMs);

            switch (currentState) {
                case RAISING: {
                    double output = pid.calculate(measuredAngle, Constants.SETPOINT_DEGREES, Constants.DT_SECONDS);
                    arm.applyOutput(output);

                    double error = Math.abs(Constants.SETPOINT_DEGREES - measuredAngle);
                    ticksWithinTolerance = (error <= Constants.ARRIVAL_TOLERANCE_DEGREES) ? ticksWithinTolerance + 1 : 0;

                    if (ticksWithinTolerance >= Constants.TICKS_TO_CONFIRM_ARRIVAL) {
                        transitionTo(State.HOLDING);
                    }
                    break;
                }

                case HOLDING: {
                    // Still running PID, not just freezing the output. This is the "hit AND
                    // hold" framing from 04_control_loops_pid: without this, the arm would sag
                    // back down under gravity the instant we stopped correcting for it.
                    double output = pid.calculate(measuredAngle, Constants.SETPOINT_DEGREES, Constants.DT_SECONDS);
                    arm.applyOutput(output);

                    if (ticksInState >= Constants.HOLD_TICKS) {
                        transitionTo(State.IDLE);
                    }
                    break;
                }

                case IDLE:
                    // nothing left to do. Same terminal shape as AutonomousStateMachine.java's IDLE
                    break;
            }
        }

        private void transitionTo(State next) {
            State previous = currentState;
            currentState = next;
            ticksInState = 0;
            ticksWithinTolerance = 0;
            for (BiConsumer<State, State> listener : transitionListeners) {
                listener.accept(previous, next);
            }
        }
    }

    // A scripted raw sensor feed: almost every tick returns the arm's true current angle,
    // except for one deliberate disconnect and one deliberate stale reading, so both branches
    // of SafeSensorReader fire exactly once during a real run instead of only in theory.
    private static SensorReading rawReadingForTick(SimulatedArm arm, int tick, long nowMs) {
        if (tick == 40) {
            return new SensorReading(null, nowMs); // disconnected: no value at all
        }
        if (tick == 90) {
            return new SensorReading(arm.getAngleDegrees(), nowMs - 500); // present, but 500ms stale
        }
        return new SensorReading(arm.getAngleDegrees(), nowMs);
    }

    public static void main(String[] args) {
        StructuredLogger logger = new StructuredLogger();
        SimplePIDController pid = new SimplePIDController(Constants.KP, Constants.KI, Constants.KD);
        SimulatedArm arm = new SimulatedArm();
        SafeSensorReader sensor = new SafeSensorReader(logger);
        ClimberStateMachine climber = new ClimberStateMachine(pid, arm, sensor);

        climber.addTransitionListener((from, to) ->
            logger.log(Level.INFO, "state transition", "from", from, "to", to, "armAngleDegrees", arm.getAngleDegrees()));

        logger.log(Level.INFO, "capstone routine starting",
            "profile", Constants.ACTIVE_PROFILE, "setpointDegrees", Constants.SETPOINT_DEGREES,
            "kP", Constants.KP, "kI", Constants.KI, "kD", Constants.KD);

        int tick;
        for (tick = 1; tick <= 400; tick++) {
            long nowMs = tick * (long) (Constants.DT_SECONDS * 1000);
            SensorReading raw = rawReadingForTick(arm, tick, nowMs);
            climber.periodic(raw, nowMs);

            if (tick % 20 == 0) {
                System.out.printf("tick %3d state=%-8s angle=%6.2f deg%n", tick, climber.getState(), arm.getAngleDegrees());
            }
            if (climber.getState() == State.IDLE) {
                break;
            }
        }

        logger.log(Level.INFO, "capstone routine finished",
            "finalState", climber.getState(), "finalAngleDegrees", arm.getAngleDegrees(), "ticksRun", tick);
    }
}
