public class ShooterConfig {

    // the RPM value
    public static final double FLYWHEEL_RPM = 4500;

    private int shotCount = 0;

    public double computeSpinUpTime(double accelerationRpmPerSecond) {
        // divide RPM by acceleration
        return FLYWHEEL_RPM / accelerationRpmPerSecond;
    }

    // adds one to shotCount
    public void recordShot() {
        shotCount = shotCount + 1;
    }

    public int getShotCount() {
        return shotCount;
    }
}
