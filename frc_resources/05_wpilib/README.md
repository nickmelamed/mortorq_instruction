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
  robotics generally, not unique to FRC.

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

The synthesis point this module is building toward: a real autonomous routine combines
all three ideas — a path from Choreo/PathPlanner, run through a drivetrain subsystem,
corrected in real time using AprilTag pose estimates from a Limelight or PhotonVision
pipeline (see `02_limelight`), all of it testable in simulation before the robot is
mechanically finished.

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
- [WPILib: Path Planning overview](https://docs.wpilib.org/en/stable/docs/software/pathplanning/index.html) — WPILib's own comparison of Choreo, PathPlanner, and (legacy) PathWeaver; check this each season for the current recommendation.

**Check for understanding / hands-on exercise suggestions:**
- Have students write a two-command autonomous sequence (e.g. "drive forward, then run intake") purely in simulation, using Glass to confirm it behaves correctly before ever touching a real robot.
- Give students a simple field layout and have them build the same path in both Choreo and PathPlanner, then compare the resulting autonomous run time and discuss any tradeoffs they noticed between the two tools.
