public class Arm {
    // TODO: replace this magic number with a named constant once we tune the real setpoint
    private static final double HOLD_ANGLE_DEGREES = 47.0;

    public void holdPosition() {
        System.out.println("Holding arm at " + HOLD_ANGLE_DEGREES + " degrees");
    }
}
