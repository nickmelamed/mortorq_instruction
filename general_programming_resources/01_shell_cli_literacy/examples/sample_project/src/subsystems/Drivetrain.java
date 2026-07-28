package subsystems;

public class Drivetrain {
    // TODO: this should read from Constants instead of being hardcoded
    private static final double MAX_SPEED = 0.8;

    public void drive(double forward, double turn) {
        System.out.println("Driving at " + (forward * MAX_SPEED));
    }
}
