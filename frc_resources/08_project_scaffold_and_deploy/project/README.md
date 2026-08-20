# Reference Project Skeleton

This is an **annotated reference skeleton, not a buildable project.** A real version of
this folder needs the actual WPILib toolchain — the WPILib VS Code extension, a real
Gradle wrapper (`gradlew`/`gradlew.bat`), and the GradleRIO plugin downloaded from
WPILib's own Gradle plugin repository — none of which is vendored into this
instructional-materials repo. There's nothing to `cd` into and run here.

The point of this folder is to be **read side by side with our team's real robot code
repository**: every file below matches the real WPILib command-based project layout
exactly, uses only real, current (2026-season) WPILib APIs, and is commented to explain
*why* each piece exists and how it connects to material elsewhere in this curriculum —
not to be a second thing to maintain separately from the actual robot code.

## Reading order

1. **`build.gradle`** — the build/deploy configuration; see the main module `README.md` §2 for a guided walkthrough of this file specifically.
2. **`settings.gradle`** — one line, just names the project.
3. **`src/main/java/frc/robot/Main.java`** — the entry point. You'll basically never edit this file.
4. **`src/main/java/frc/robot/Robot.java`** — wires WPILib's periodic loop to the `CommandScheduler` (see `back_end_resources/systems_primer/01_concurrency_realtime_loops`).
5. **`src/main/java/frc/robot/Constants.java`** — the centralized-constants pattern from `back_end_resources/systems_primer/09_configuration_constants_management`, in its real project location.
6. **`src/main/java/frc/robot/subsystems/IntakeSubsystem.java`** — one subsystem, owning one mechanism's hardware.
7. **`src/main/java/frc/robot/commands/RunIntakeCommand.java`** — one command, acting on that subsystem.
8. **`src/main/java/frc/robot/RobotContainer.java`** — ties the subsystem, the command, and a controller binding together.

## Why `PWMSparkMax` instead of a real CAN motor controller

`IntakeSubsystem` uses core WPILib's built-in `PWMSparkMax`, not REVLib's `SparkMax` or
CTRE's `TalonFX` (the CAN-based controllers a real competition intake almost always
uses — see `frc_resources/06_hardware_debugging`). That's a deliberate scope choice, not
a claim that real teams should wire intakes over PWM: vendor library APIs change from
season to season, and this reference skeleton is meant to compile-and-read correctly
against nothing but WPILib itself, with no vendor version to keep in sync. Swapping
`PWMSparkMax` for a real vendor motor controller class is a small, mechanical change once
you're working in our team's actual repository against a real, current vendor library
version.
