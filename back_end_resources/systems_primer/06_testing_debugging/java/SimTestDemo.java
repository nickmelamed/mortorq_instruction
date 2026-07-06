// 06 - Testing & Debugging: exercising real robot logic in simulation
//
// Runs the actual AutonomousStateMachine from 03_state_machines/java, tick
// by tick, with no Thread.sleep and no real robot loop -- exactly the point
// of simulation: there's no real hardware to stay in sync with, so ticks
// can run as fast as the CPU allows. A real WPILib simulation would swap in
// simulated motors/sensors underneath the same subsystem code; this demo
// simplifies that down to "run the logic itself, fast, and check the
// outcome," which is the same underlying idea.
//
// Compile and run (see concept.md for why this imports 03's file directly):
//   $ javac -d bin SimTestDemo.java ../../03_state_machines/java/AutonomousStateMachine.java
//   $ java -cp bin SimTestDemo
public class SimTestDemo {

    static final int MAX_TICKS = 20;
    static final AutonomousStateMachine.State EXPECTED_FINAL_STATE = AutonomousStateMachine.State.IDLE;

    public static void main(String[] args) {
        AutonomousStateMachine autonomous = new AutonomousStateMachine();

        long simStart = System.nanoTime();

        int tick;
        for (tick = 1; tick <= MAX_TICKS; tick++) {
            autonomous.periodic();
            if (autonomous.getState() == EXPECTED_FINAL_STATE) {
                break;
            }
        }

        long simElapsedMs = (System.nanoTime() - simStart) / 1_000_000;

        boolean reachedExpectedState = autonomous.getState() == EXPECTED_FINAL_STATE;
        // The for-loop's own increment still runs once more before its
        // condition fails when the loop reaches MAX_TICKS without ever
        // hitting `break` (the FAIL case below) -- clamp back to MAX_TICKS
        // so a FAIL run doesn't report having simulated one tick more than
        // periodic() was actually called.
        int ticksRun = Math.min(tick, MAX_TICKS);

        System.out.printf("%nsimulated %d ticks in %dms of real time%n", ticksRun, simElapsedMs);
        System.out.printf("final state: %s (expected %s)%n", autonomous.getState(), EXPECTED_FINAL_STATE);

        if (reachedExpectedState) {
            System.out.println("PASS: routine reached IDLE within " + MAX_TICKS + " ticks");
        } else {
            System.out.println("FAIL: routine did not reach IDLE within " + MAX_TICKS + " ticks");
        }

        // On a real robot, those same ticks would take ticksRun * 20ms of
        // real, wall-clock match time to actually happen. Simulating them
        // takes only however long the CPU needs to run the logic itself,
        // which is why simulation is both faster to iterate on and safe to
        // run as many times as you want.
        System.out.printf(
            "(on a real robot, those same %d ticks would take about %dms of real match time)%n",
            ticksRun, ticksRun * 20);
    }
}
