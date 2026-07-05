// 06 - Testing & Debugging: unit-testing the state machine from 03
//
// Tests AutonomousStateMachine (03_state_machines/java/AutonomousStateMachine.java)
// directly -- no robot, no hardware, just calling periodic() repeatedly and
// checking the resulting state. See concept.md for the exact compile/run
// commands, including the JUnit + Hamcrest jars this file needs on the
// classpath.
import static org.junit.Assert.assertEquals;

import org.junit.Before;
import org.junit.Test;

public class ExampleUnitTest {

    private AutonomousStateMachine autonomous;

    @Before
    public void setUp() {
        // A fresh state machine before every test -- tests shouldn't leak
        // state into each other.
        autonomous = new AutonomousStateMachine();
    }

    @Test
    public void startsInIntakeState() {
        assertEquals(AutonomousStateMachine.State.INTAKE, autonomous.getState());
    }

    @Test
    public void staysInIntakeUntilPieceDetected() {
        // The real machine takes 4 ticks to detect a piece; one tick short
        // of that, it should still be in INTAKE.
        for (int i = 0; i < 3; i++) {
            autonomous.periodic();
        }
        assertEquals(AutonomousStateMachine.State.INTAKE, autonomous.getState());
    }

    @Test
    public void transitionsToTransportAfterPieceDetected() {
        for (int i = 0; i < 4; i++) {
            autonomous.periodic();
        }
        assertEquals(AutonomousStateMachine.State.TRANSPORT, autonomous.getState());
    }

    @Test
    public void reachesIdleByEndOfRoutine() {
        // 4 ticks to detect the piece + 5 to reach scoring position + 3 to
        // release it = 12 ticks to reach IDLE. Run a couple extra to be sure
        // it actually stays there instead of transitioning again.
        for (int i = 0; i < 14; i++) {
            autonomous.periodic();
        }
        assertEquals(AutonomousStateMachine.State.IDLE, autonomous.getState());
    }

    @Test
    public void notifiesListenersOnEveryTransition() {
        int[] transitionCount = {0};
        autonomous.addTransitionListener((from, to) -> transitionCount[0]++);

        for (int i = 0; i < 14; i++) {
            autonomous.periodic();
        }

        // INTAKE -> TRANSPORT -> SCORE -> IDLE is exactly 3 transitions.
        assertEquals(3, transitionCount[0]);
    }
}
