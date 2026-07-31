# Running these demos

Read `../concept.md` first. Both files here are standalone Java files: no WPILib project, no build tool, just `javac`/`java` directly.

```text
$ javac OdometryDemo.java
$ java OdometryDemo
```

Two runs print side by side: no correction, then a correction every 5 simulated seconds. In the uncorrected run, `drift` climbs the entire 20 seconds. In the corrected run, watch it grow between corrections and drop back down right after one - the same sawtooth pattern a real robot's periodic AprilTag correction produces against its wheel odometry.

```text
$ javac PurePursuitDemo.java
$ java PurePursuitDemo
```

The robot starts slightly off the path on purpose. Watch `targeting waypoint` advance forward through the path as the robot catches up to it, and `distance-to-goal` shrink tick by tick, until the robot arrives within `ARRIVAL_TOLERANCE` of the final waypoint.
