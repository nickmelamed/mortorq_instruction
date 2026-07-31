// 04b - Motion Control and Trajectories: Pure Pursuit path following
//
// Steers a simulated robot along a small, fixed path (a handful of waypoints forming a
// gentle curve) using the Pure Pursuit algorithm: every tick, find a point on the path
// one "lookahead distance" ahead of the robot's current position, compute the arc that
// would carry the robot there, and drive along it. Recompute both every tick, exactly
// the way a real robot would recompute against its live odometry-based position estimate
// (see OdometryDemo.java) rather than planning the whole path's steering once in advance.
//
// This demo picks the lookahead target by walking forward through the waypoint list --
// a simplification of the real algorithm's continuous circle/line-segment intersection,
// but it preserves the core idea (steer toward a point some distance ahead) without the
// extra geometry.
//
// Compile and run directly:
//   $ javac PurePursuitDemo.java
//   $ java PurePursuitDemo
public class PurePursuitDemo {

    static class Point {
        final double x, y;

        Point(double x, double y) {
            this.x = x;
            this.y = y;
        }

        double distanceTo(Point other) {
            double dx = x - other.x;
            double dy = y - other.y;
            return Math.sqrt(dx * dx + dy * dy);
        }
    }

    static class Pose {
        double x, y, headingRadians;

        Pose(double x, double y, double headingRadians) {
            this.x = x;
            this.y = y;
            this.headingRadians = headingRadians;
        }

        Point toPoint() {
            return new Point(x, y);
        }
    }

    private static final double LOOKAHEAD_DISTANCE = 1.0;
    private static final double LINEAR_VELOCITY = 1.0;    // units/sec
    private static final double DT_SECONDS = 0.02;         // matches the 20ms periodic loop
    private static final double ARRIVAL_TOLERANCE = 0.1;   // "close enough" to the final waypoint

    // A gentle curved path across the field, expressed as waypoints -- exactly the kind
    // of output Choreo/PathPlanner would hand off (see frc_resources/05_wpilib).
    private static final Point[] PATH = {
        new Point(0.0, 0.0),
        new Point(2.0, 0.0),
        new Point(4.0, 1.0),
        new Point(6.0, 3.0),
        new Point(8.0, 3.0),
    };

    // Walk forward from the last-targeted waypoint (never backward) until we find one at
    // least LOOKAHEAD_DISTANCE away from the robot's current position, or run out of path.
    private static int findLookaheadWaypointIndex(Pose robot, int searchFromIndex) {
        int index = searchFromIndex;
        while (index < PATH.length - 1 && robot.toPoint().distanceTo(PATH[index]) < LOOKAHEAD_DISTANCE) {
            index++;
        }
        return index;
    }

    // The standard Pure Pursuit curvature formula: transform the lookahead point into the
    // robot's own reference frame, then curvature = 2 * (lateral offset) / (lookahead^2).
    private static double curvatureToward(Pose robot, Point target) {
        double dx = target.x - robot.x;
        double dy = target.y - robot.y;

        // Rotate the field-frame offset into the robot's frame (rotate by -heading).
        double localY = -dx * Math.sin(robot.headingRadians) + dy * Math.cos(robot.headingRadians);

        double actualLookahead = robot.toPoint().distanceTo(target);
        if (actualLookahead < 1e-6) {
            return 0.0;
        }
        return (2.0 * localY) / (actualLookahead * actualLookahead);
    }

    public static void main(String[] args) {
        Pose robot = new Pose(0.0, -0.5, 0.0); // start slightly off the path, facing along it
        Point finalWaypoint = PATH[PATH.length - 1];
        int lookaheadIndex = 0;

        System.out.println("Following a 4-segment path with Pure Pursuit...");
        System.out.printf("Start: (%.2f, %.2f), heading=%.2f rad%n%n",
            robot.x, robot.y, robot.headingRadians);

        int tick = 0;
        while (robot.toPoint().distanceTo(finalWaypoint) > ARRIVAL_TOLERANCE) {
            tick++;
            lookaheadIndex = findLookaheadWaypointIndex(robot, lookaheadIndex);
            Point target = PATH[lookaheadIndex];

            double curvature = curvatureToward(robot, target);
            double angularVelocity = curvature * LINEAR_VELOCITY;

            robot.headingRadians += angularVelocity * DT_SECONDS;
            robot.x += LINEAR_VELOCITY * DT_SECONDS * Math.cos(robot.headingRadians);
            robot.y += LINEAR_VELOCITY * DT_SECONDS * Math.sin(robot.headingRadians);

            if (tick % 100 == 0) {
                System.out.printf(
                    "tick %4d: pose=(%.2f, %.2f) heading=%.2f rad  targeting waypoint %d %s  distance-to-goal=%.2f%n",
                    tick, robot.x, robot.y, robot.headingRadians, lookaheadIndex,
                    String.format("(%.1f, %.1f)", target.x, target.y),
                    robot.toPoint().distanceTo(finalWaypoint));
            }

            if (tick > 5000) {
                System.out.println("Not converging - stopping early.");
                break;
            }
        }

        System.out.printf("%nReached (%.2f, %.2f) after %d ticks (%.1fs), %.2f units from the final waypoint.%n",
            robot.x, robot.y, tick, tick * DT_SECONDS, robot.toPoint().distanceTo(finalWaypoint));
    }
}
