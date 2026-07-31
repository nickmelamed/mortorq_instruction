# 05 — WPILib: Command-Based Architecture, Simulation, and Path Planning

## 1. The General Idea

Three general software-engineering ideas come together in this module:

- **Command-based architecture** is a design pattern for controlling independent
  physical mechanisms: each mechanism gets a self-contained object that owns its
  hardware (a **subsystem**), and behaviors are written as discrete, composable units
  (**commands**) that request control of the subsystems they need. A central
  **scheduler** runs the currently-active commands each cycle and resolves conflicts —
  if two commands both want the same subsystem, the scheduler decides which one runs.
  This is a specific case of a more general pattern (task scheduling with resource
  ownership) used anywhere multiple independent behaviors have to share hardware
  without stepping on each other.
- **Simulation** means running your code against a virtual model of the hardware instead
  of the real thing — a standard technique anywhere real hardware is expensive, slow to
  iterate on, or simply not available yet, letting software work proceed in parallel
  with, rather than strictly after, physical construction.
- **Path planning / trajectory generation** is the general problem of computing a
  smooth, physically-achievable path from a start state to a goal state, subject to
  constraints like maximum velocity and acceleration — a core problem in mobile
  robotics generally, not unique to FRC. What those constraints actually mean (motion
  profiling) and how a robot follows the resulting path in real time (Pure Pursuit,
  and the odometry that feeds it) is covered in
  `back_end_resources/systems_primer/04b_motion_control_and_trajectories` — this
  module is about the tools that produce and correct the path, not the control theory
  underneath it.

## 2. What This Looks Like in FRC

**Command-based programming** is WPILib's standard architecture (current as of the 2026
season): each robot mechanism (drivetrain, arm, intake) is a `Subsystem`; behaviors like
"drive to a point," "run intake until a sensor triggers," or "hold arm at an angle" are
`Command` objects; the `CommandScheduler` runs once per periodic cycle, executing active
commands and enforcing that a subsystem is only ever controlled by one command at a
time. Autonomous routines and even most of teleop control are typically built by
composing smaller commands together (sequences, parallel groups, conditionals) rather
than writing one large monolithic autonomous method.

**Simulation**: WPILib ships physics-based simulation classes for common mechanisms
(drivetrains, elevators, arms, flywheels) that let you run and test robot code against a
modeled version of your mechanism's real-world physics — with **Glass** as the
visualization tool for watching simulated mechanism state (position, velocity) update
live as your code runs, without a physical robot present at all.

**Path planning**: the current standard tools (as of the 2026 season) are **Choreo** and
**PathPlanner** — both provide a visual editor for laying out a path across the field
and both natively support **swerve drive** (holonomic motion, where the robot can
translate and rotate independently). They replace **PathWeaver**, which is deprecated
and scheduled for removal starting the 2027 season.

Laying out the path in the editor is only half the job — PathPlannerLib's
`FollowPathCommand` is what actually drives the robot along it, and it's worth being
concrete about how, since "PathPlanner follows the path" hides a real design choice.
For a swerve drivetrain, it uses `PPHolonomicDriveController`: separate PID controllers
for X, Y, and heading, each correcting against the trajectory's target state for the
current moment in time. This is a *different* mechanism than the classic Pure Pursuit
algorithm covered generally in
`back_end_resources/systems_primer/04b_motion_control_and_trajectories` — Pure Pursuit's
lookahead-point/curvature trick exists specifically to let a non-holonomic (differential
drive) robot, which can't strafe, convert "get to this point" into a turning radius. A
swerve robot doesn't have that constraint at all, so PathPlanner drives it with direct
per-axis PID instead; for differential drivetrains, PathPlanner instead uses
`PPLTVController`, a different (LTV, or Linear Time-Varying) controller suited to that
drivetrain's constraints. Both are still the same underlying idea `04b` covers in
general — closed-loop correction against a live position estimate, every cycle — just
two different concrete algorithms for two different drivetrain geometries, not "the"
one path-following algorithm.

That live position estimate is where vision actually enters the picture, and it enters
in two distinct ways worth telling apart:

1. **Vision corrects the pose estimator PathPlanner reads from.** PathPlanner's
   controllers only ever see whatever pose your `SwerveDrivePoseEstimator` (or
   equivalent) reports as "current position" — PathPlanner itself has no idea whether
   that pose came from pure wheel/gyro odometry or from odometry fused with AprilTag
   readings via `addVisionMeasurement()`. Feeding it a vision-corrected pose is exactly
   the drift-correction idea from `04b`, just supplied to PathPlanner's controller
   instead of read directly.
2. **PathPlanner can generate a fresh path to a vision-derived target pose in real
   time**, via its on-the-fly pathfinding feature: instead of running a path drawn in
   the editor ahead of time, you hand it a `Pose2d` goal and it plans (and re-plans, as
   obstacles or the target move) a path to it live. A target pose computed from a
   detected AprilTag — "the scoring position half a meter in front of this tag" — is
   exactly the shape of input this expects, though PathPlanner itself doesn't do the
   vision detection or the pose math; that conversion from a Limelight/PhotonVision
   reading to a `Pose2d` happens in your own code (see `02_limelight`). PathPlanner's
   own docs recommend combining the two: pathfind to get close, then hand off to a
   precision, editor-authored path for delicate final alignment (a human player
   station, a scoring position) where on-the-fly replanning's small path changes
   mid-execution would be a liability rather than a convenience.

The synthesis point this module is building toward: a real autonomous routine combines
all three ideas — a path from Choreo/PathPlanner, run through a drivetrain subsystem
using whichever of the controllers above matches its geometry, corrected in real time
using AprilTag pose estimates from a Limelight or PhotonVision pipeline (see
`02_limelight`), all of it testable in simulation before the robot is mechanically
finished.

## 3. Where It Diverges From the General Case

The six-week build season (see `01_frc_intro`) is the direct reason simulation is
emphasized as hard here rather than optional: a programming subteam that waits for the
mechanical build to finish before writing and testing code is giving away weeks of the
season. Simulation, run against a physics model of the mechanism being built, is how
programmers can write, tune, and partially validate subsystem and autonomous code
*before* the physical mechanism exists — closing a gap that in most other software
contexts (where hardware is either already available or not a factor at all) doesn't
need this kind of deliberate parallelization.

The PathWeaver-to-Choreo/PathPlanner shift is a direct, concrete example of an FRC
constraint invalidating an older tool: PathWeaver's underlying trajectory framework
didn't model **independent heading** — on a swerve drive, a robot can be translating in
one direction while facing an entirely different one, and a path tool built around
differential-drive assumptions can't represent that. As swerve became the dominant FRC
drivetrain, a path-planning tool that couldn't natively express holonomic motion stopped
being good enough, which is why WPILib is retiring it rather than continuing to maintain
it alongside swerve-aware alternatives.

The same swerve dominance explains why the textbook Pure Pursuit path-following
algorithm (`back_end_resources/systems_primer/04b_motion_control_and_trajectories`)
isn't what's actually running on most current FRC robots, even though it's the classic
algorithm for the general "follow a path" problem. Pure Pursuit's whole reason for
existing — converting "reach this point" into a turning radius — is a workaround for
not being able to move sideways. A swerve robot doesn't have that limitation, so the
constraint the algorithm exists to work around simply isn't there anymore, and
PathPlanner drives swerve robots with direct per-axis PID instead. It's the same
underlying pressure as the PathWeaver deprecation above, just showing up one layer
down: as swerve became dominant, tools and algorithms built around differential-drive
assumptions stopped being the default, not because they became wrong, but because
FRC's hardware landscape moved out from under the assumption they were built on.

Command-based architecture itself is a fairly direct import of a general software
pattern, but FRC's version of "resource conflict" is physical, not just logical — two
commands fighting over the same subsystem in FRC usually means two pieces of code
sending conflicting motor voltage commands to the same physical motor, so the
scheduler's conflict resolution isn't just a style preference, it's what prevents
actually damaging hardware.

## Resources

- [WPILib: Command-Based Programming](https://docs.wpilib.org/en/stable/docs/software/commandbased/index.html) — the official guide to subsystems, commands, and the scheduler described in §2.
- [WPILib: Simulation](https://docs.wpilib.org/en/stable/docs/software/wpilib-tools/robot-simulation/introduction.html) — official docs on physics simulation and Glass.
- [Choreo Documentation](https://choreo.autos/) — official docs for the current-standard trajectory tool.
- [PathPlanner Documentation](https://pathplanner.dev/home.html) — official docs for the other current-standard trajectory tool.
- [PathPlannerLib: Following a Single Path](https://pathplanner.dev/pplib-follow-a-single-path.html) — the actual `PPHolonomicDriveController`/`PPLTVController` mechanism described in §2, straight from the source.
- [PathPlannerLib: Pathfinding](https://pathplanner.dev/pplib-pathfinding.html) — the on-the-fly, `Pose2d`-target pathfinding feature described in §2, including the navgrid/obstacle setup and the "pathfind-then-precision-path" pattern.
- [WPILib: Pose Estimators](https://docs.wpilib.org/en/stable/docs/software/advanced-controls/state-space/state-space-pose-estimators.html) — how `addVisionMeasurement()` actually fuses AprilTag readings into the pose estimate PathPlanner's controllers consume.
- [WPILib: Path Planning overview](https://docs.wpilib.org/en/stable/docs/software/pathplanning/index.html) — WPILib's own comparison of Choreo, PathPlanner, and (legacy) PathWeaver; check this each season for the current recommendation.

**Check for understanding / hands-on exercise suggestions:**
- Have students write a two-command autonomous sequence (e.g. "drive forward, then run intake") purely in simulation, using Glass to confirm it behaves correctly before ever touching a real robot.
- Give students a simple field layout and have them build the same path in both Choreo and PathPlanner, then compare the resulting autonomous run time and discuss any tradeoffs they noticed between the two tools.
- Ask students to trace, in words, everything that happens between "a Limelight detects an AprilTag" and "the drivetrain motors turn a specific amount" for a robot following a PathPlanner path — which piece is vision, which piece is the pose estimator, and which piece is `PPHolonomicDriveController` — to make sure the three distinct roles from §2 don't collapse into one fuzzy "the robot uses vision to follow the path" idea.
