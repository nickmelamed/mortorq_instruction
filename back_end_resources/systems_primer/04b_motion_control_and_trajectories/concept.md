# 04b - Motion Control and Trajectories: From a Setpoint to a Path

## From One Setpoint to a Path Across the Field

`04_control_loops_pid` covered PID converging on a single, fixed setpoint, like an arm angle or a flywheel speed. But a real autonomous routine isn't holding one number, it's moving the robot through a whole sequence of field positions over time, arriving at each one at roughly the right moment. `frc_resources/05_wpilib` already named the tool that produces this sequence: Choreo/PathPlanner generate a **trajectory**, "a smooth, physically-achievable path from a start state to a goal state, subject to constraints like maximum velocity and acceleration". However, this is without ever explaining how the robot actually follows one, or where its own position estimate even comes from. This module is that missing middle layer: motion profiling, path following, and the odometry both of those depend on. Everything here assumes the path itself was decided in advance and stays valid; the deeper, AV-style problem of a path that has to react to a world that keeps changing after it was planned is its own follow-on topic, covered later in `ml_resources/perception_primer/09-planning-and-av-context.ipynb`.

## Open-Loop vs. Closed-Loop Control

**Open-loop control** acts without checking the outcome: "drive at 50% power for 2 seconds," then stop, regardless of what actually happened. **Closed-loop control** constantly re-measures and corrects. PID, from `04_control_loops_pid`, is closed-loop by definition, since every tick recomputes error from a fresh measurement.

It's tempting to map this directly onto the match's own two phases - autonomous is open-loop, teleop is closed-loop - but that's not quite right, and it's worth correcting:

- A **naive (dead-reckoning) autonomous routine** - for example, driving for two seconds then stopping, or more generally, timed motor voltage commands, no sensor feedback at all. Any of these are open-loop, because we are not getting any type of feedback like position. 
- A **modern (trajectory-following) autonomous routine** - the kind this module is building toward is closed-loop: it continuously checks the robot's actual position (via odometry, below) against where the trajectory says it should be, and corrects.
- **Teleop's drivetrain code** can itself be open-loop (joystick value goes straight to motor voltage, with nothing checking what actually happened). Worth noting that teleop is never *actually* uncorrected, because a human driver, watching the robot and adjusting the joystick in response, is a closed feedback loop too. It's just implemented by a nervous system instead of a `periodic()` method.

The distinction that actually matters isn't down to autonomous vs. teleop mode, but rather an understanding of what is going on underneath the hood. 

## Motion Profiling: Shaping the Path, Not Just the Destination

Handing PID a single far-off setpoint directly (e.g., "the trajectory ends 4 meters away, go") leaves PID's own P/I/D math to improvise the acceleration and deceleration shape, which tends to produce exactly the overshoot and oscillation `04_control_loops_pid` warned about. **Motion profiling** fixes this by precomputing a whole *sequence* of intermediate position/velocity/acceleration targets between here and the goal, respecting real physical limits (maximum velocity, maximum acceleration) along the way. Instead of chasing one far-off point, PID (frequently paired with feedforward, also from `04`) is always chasing a nearby, already-achievable intermediate target. It gives us smoother motion, and a much easier job for the feedback controller. This is exactly the "constraints like maximum velocity and acceleration" `frc_resources/05_wpilib` mentioned Choreo/PathPlanner handling; a motion profile is what that phrase actually refers to.

## Path Following: Pure Pursuit

A generated trajectory and a motion profile still leave one open question: given the robot's *current* position, which direction should it actually steer right now to stay on the path? **Pure Pursuit** is a widely-used answer: pick a point on the path some fixed **lookahead distance** ahead of the robot's current position, then steer along whatever arc would carry the robot from where it is now to that point. Recompute the lookahead point and the arc every tick, as the robot's position estimate updates. A short lookahead hugs the path tightly but reacts jerkily to noise; a long lookahead cuts corners smoothly but tracks the path more loosely. This is a genuinely different kind of algorithm than PID (it's geometric - literally aiming at a point - rather than an error/correction loop), but it still needs a real-time position estimate to work at all, which makes it just as dependent on closing the loop as PID is.

```text
                                    . . the path . .
                              . '                     ' .
                        . '           lookahead            ' .
                  . '             .--- distance ---.             ' .
            . '                 /                   \                 ' .
      ---.'-------------------X-------------------------.----------------
         ^                     ^                          '.
      robot's              lookahead point:                  '.
      current               a point on the path                the arc the
      position              exactly one lookahead               robot actually
                             distance ahead of the               drives along
                             robot right now                     this tick, aimed
                                                                  at that point

    Every tick: find the lookahead point again (the robot and the path
    haven't moved relative to each other by much in 20ms), compute the arc
    from the robot's current pose to that point, steer along it, repeat.
    A short lookahead distance pulls that point in tight to the robot -- more
    responsive, but jittery. A long one pushes it further down the path --
    smoother, but the robot starts cutting corners on curves.
```

Pure Pursuit's one blind spot is that it only ever follows a path decided in advance. It has no way to notice something new has rolled into that path since it was generated. Handling that is a genuinely deeper problem than anything in this module, one FRC only sees a sliver of but that self-driving cars deal with constantly: it's the autonomous-vehicle (AV) version of "planning," where the path itself has to react to a world that keeps changing after the plan was made. `ml_resources/perception_primer/09-planning-and-av-context.ipynb` is the dedicated follow-on for exactly that: occupancy grids for representing what's currently blocking a planned path, and a reactive alternative (artificial potential fields) for when replanning a whole new path is too slow to be worth it.

## Odometry: Where "Current Position" Actually Comes From

Both PID (correcting drivetrain heading or velocity) and Pure Pursuit (picking a lookahead point) assume the robot already knows roughly where it is. **Odometry** is how that estimate is built: every tick - inside the same 20ms periodic loop from `01_concurrency_realtime_loops` - combine how far the wheels turned (encoders) with which way the robot is facing (gyro) into a small position step, and add that step onto a running total. This is exactly the mechanism `ml_resources/perception_primer/05-objects-in-motion.ipynb` referenced without explaining: *"our gyro and drivetrain encoders, fused through something like WPILib's `SwerveDrivePoseEstimator`."*

Because each tick's position update is a small step *added onto the previous total*, any small, consistent measurement error (like a wheel diameter that's 2% off from its calibrated value, tiny encoder noise) doesn't cancel out over time. It accumulates, tick after tick, into **drift**: the same failure mode `perception_primer/05` already named for Visual Odometry, where small pose errors accumulate frame after frame with nothing to correct them, "the same way pure wheel odometry drifts over the course of a long match." The fix is the same one used there too: an absolute, non-accumulating position reading, like an AprilTag pose estimate from `frc_resources/02_limelight`, for instance, periodically snaps the running estimate back to ground truth, resetting drift to zero instead of letting it grow for the rest of the match.

## Putting it together

`java/OdometryDemo.java` integrates a simulated robot's position from biased "sensor" readings, once with no correction (watch drift grow across the whole run) and once with a periodic absolute correction (watch drift reset instead of accumulating). `java/PurePursuitDemo.java` steers a simulated robot along a small fixed path using the lookahead-point calculation described above, tick by tick, until it reaches the end.

## Resources

- [WPILib: Trajectory Generation and Following](https://docs.wpilib.org/en/stable/docs/software/pathplanning/trajectories/index.html) - the official conceptual walkthrough of motion profiles and trajectory following.
- [WPILib: Pose Estimators](https://docs.wpilib.org/en/stable/docs/software/advanced-controls/geometry/pose-estimators.html) - the real `SwerveDrivePoseEstimator`/`DifferentialDrivePoseEstimator` classes this module's odometry demo is a simplified stand-in for.
- Coulter, R.C. (1992). "Implementation of the Pure Pursuit Path Tracking Algorithm." Carnegie Mellon University Robotics Institute Technical Report CMU-RI-TR-92-01. The original paper behind the algorithm in `PurePursuitDemo.java` (paper).
- [WPILib: Odometry](https://docs.wpilib.org/en/stable/docs/software/kinematics-and-odometry/index.html) - the official reference for how encoder and gyro readings combine into a position estimate.
