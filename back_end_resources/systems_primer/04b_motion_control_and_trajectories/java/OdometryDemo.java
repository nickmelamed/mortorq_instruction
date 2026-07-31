// 04b - Motion Control and Trajectories: odometry drift, with and without correction
//
// Simulates a robot driving a gentle 20-second arc at constant speed and turn rate.
// "True" position is computed from exact kinematics. The "estimated" (odometry) position
// instead integrates a slightly miscalibrated sensor reading each tick -- a 2% wheel-radius
// error, the kind a real robot could easily have -- to show how a small, constant, per-tick
// error compounds into real drift over time, purely because odometry always builds each
// estimate on top of the previous one instead of measuring position freshly.
//
// Two runs are printed: one with no correction at all, and one where every 5 seconds an
// absolute reading (standing in for an AprilTag pose estimate) snaps the estimate back to
// the true position. Compare how "drift" behaves across the two.
//
// Compile and run directly:
//   $ javac OdometryDemo.java
//   $ java OdometryDemo
public class OdometryDemo {

    static class Pose {
        double x, y, headingRadians;

        Pose(double x, double y, double headingRadians) {
            this.x = x;
            this.y = y;
            this.headingRadians = headingRadians;
        }
    }

    // Constant linear/angular velocity -- a simple, deterministic stand-in for "driving
    // a gentle curve," not a realistic drivetrain model.
    private static final double LINEAR_VELOCITY = 1.0;   // units/sec
    private static final double ANGULAR_VELOCITY = 0.1;  // radians/sec
    private static final double DT_SECONDS = 0.02;        // matches the 20ms periodic loop
    private static final int TOTAL_TICKS = 1000;          // 20 seconds of simulated driving

    // A real robot's wheel radius is never known to perfect precision -- 2% off from the
    // calibrated value used in code is a realistic, easy-to-overlook error.
    private static final double SENSED_DISTANCE_SCALE = 1.02;

    private static double distance(Pose a, Pose b) {
        double dx = a.x - b.x;
        double dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // correctionIntervalTicks <= 0 means "never correct."
    private static void runSimulation(String label, int correctionIntervalTicks) {
        Pose truePose = new Pose(0.0, 0.0, 0.0);
        Pose estimatedPose = new Pose(0.0, 0.0, 0.0);

        System.out.printf("%n--- %s ---%n", label);

        for (int tick = 1; tick <= TOTAL_TICKS; tick++) {
            // Ground truth: exact kinematics, no sensor involved.
            double trueDistanceThisTick = LINEAR_VELOCITY * DT_SECONDS;
            truePose.headingRadians += ANGULAR_VELOCITY * DT_SECONDS;
            truePose.x += trueDistanceThisTick * Math.cos(truePose.headingRadians);
            truePose.y += trueDistanceThisTick * Math.sin(truePose.headingRadians);

            // Odometry: integrates a biased "sensed" distance, and (for simplicity) an
            // otherwise-perfect gyro heading -- real gyros drift far less than wheel
            // odometry does over a match, so isolating the distance-scale error keeps
            // this demo focused on the more common real-world drift source.
            double sensedDistanceThisTick = trueDistanceThisTick * SENSED_DISTANCE_SCALE;
            estimatedPose.headingRadians += ANGULAR_VELOCITY * DT_SECONDS;
            estimatedPose.x += sensedDistanceThisTick * Math.cos(estimatedPose.headingRadians);
            estimatedPose.y += sensedDistanceThisTick * Math.sin(estimatedPose.headingRadians);

            if (correctionIntervalTicks > 0 && tick % correctionIntervalTicks == 0) {
                // Standing in for an AprilTag PnP reading: an absolute position fix,
                // not built on top of the previous estimate, so it isn't subject to
                // the same accumulating error.
                estimatedPose.x = truePose.x;
                estimatedPose.y = truePose.y;
            }

            if (tick % 100 == 0) {
                double drift = distance(truePose, estimatedPose);
                System.out.printf(
                    "tick %4d (t=%5.1fs): true=(%.3f, %.3f)  estimated=(%.3f, %.3f)  drift=%.3f%n",
                    tick, tick * DT_SECONDS, truePose.x, truePose.y,
                    estimatedPose.x, estimatedPose.y, drift);
            }
        }
    }

    public static void main(String[] args) {
        runSimulation("No correction", 0);
        runSimulation("Corrected every 5 seconds (250 ticks)", 250);
    }
}
