// 03 - State Machines: Intake -> Transport -> Score -> Idle
//
// A minimal autonomous routine modeled as an enum-based state machine, with
// a periodic()-style update method meant to be called once per robot tick
// (see 01_concurrency_realtime_loops). No real hardware is used -- each
// state's "is it time to transition?" check is driven by a simulated
// sensor (just a tick counter standing in for "intake sensor fired" or
// "reached the scoring position").
//
// addTransitionListener() exists so other code can react to state changes
// without this class needing to know who's listening -- the same
// publish/subscribe shape NetworkTablesDemo.java used in
// 02_communication_serialization. 07_logging_observability's
// StructuredLoggingDemo.java reuses this exact class and attaches a logging
// listener to it, instead of duplicating the state machine logic.
//
// Compile and run directly:
//   $ javac AutonomousStateMachine.java
//   $ java AutonomousStateMachine
import java.util.ArrayList;
import java.util.List;
import java.util.function.BiConsumer;

public class AutonomousStateMachine {

    public enum State {
        INTAKE,
        TRANSPORT,
        SCORE,
        IDLE
    }

    // How many ticks each state's simulated sensor takes to fire. On a real
    // robot these would be actual sensor reads (a beam-break sensor, an
    // odometry position check, a limit switch), not a fixed countdown.
    private static final int TICKS_UNTIL_PIECE_DETECTED = 4;
    private static final int TICKS_UNTIL_AT_SCORING_POSITION = 5;
    private static final int TICKS_UNTIL_PIECE_RELEASED = 3;

    private State currentState = State.INTAKE;
    private int ticksInState = 0;
    private final List<BiConsumer<State, State>> transitionListeners = new ArrayList<>();

    public State getState() {
        return currentState;
    }

    public void addTransitionListener(BiConsumer<State, State> listener) {
        transitionListeners.add(listener);
    }

    // Call this once per tick, exactly like a WPILib Subsystem's periodic().
    // Runs whatever the current state should be doing this tick, then checks
    // whether it's time to move to the next state.
    public void periodic() {
        ticksInState++;

        switch (currentState) {
            case INTAKE:
                runIntakeMotor();
                if (ticksInState >= TICKS_UNTIL_PIECE_DETECTED) {
                    transitionTo(State.TRANSPORT);
                }
                break;

            case TRANSPORT:
                driveTowardScoringPosition();
                if (ticksInState >= TICKS_UNTIL_AT_SCORING_POSITION) {
                    transitionTo(State.SCORE);
                }
                break;

            case SCORE:
                runScoringMechanism();
                if (ticksInState >= TICKS_UNTIL_PIECE_RELEASED) {
                    transitionTo(State.IDLE);
                }
                break;

            case IDLE:
                holdPosition();
                break; // no transition out of IDLE in this simple routine
        }
    }

    private void transitionTo(State next) {
        State previous = currentState;
        currentState = next;
        ticksInState = 0;
        for (BiConsumer<State, State> listener : transitionListeners) {
            listener.accept(previous, next);
        }
    }

    // Each of these stands in for real subsystem work -- running a motor,
    // driving to a position, holding still. Deliberately fast and bounded,
    // as every tick's worth of work in a periodic loop should be.
    private void runIntakeMotor() {
        System.out.println("  [INTAKE] running intake motor, watching for a piece...");
    }

    private void driveTowardScoringPosition() {
        System.out.println("  [TRANSPORT] driving toward scoring position...");
    }

    private void runScoringMechanism() {
        System.out.println("  [SCORE] running scoring mechanism...");
    }

    private void holdPosition() {
        System.out.println("  [IDLE] holding position, nothing left to do.");
    }

    public static void main(String[] args) {
        AutonomousStateMachine autonomous = new AutonomousStateMachine();

        autonomous.addTransitionListener((from, to) ->
            System.out.printf(">> transition: %s -> %s%n", from, to));

        System.out.println("Running a simulated autonomous routine, tick by tick:\n");
        for (int tick = 1; tick <= 14; tick++) {
            System.out.println("tick " + tick + " (state=" + autonomous.getState() + "):");
            autonomous.periodic();
        }
    }
}
