# 07 — Project Scaffold and Deploy

## 1. The General Idea

A **build tool** for a compiled language does more than just "turn source into a runnable artifact." It resolves and downloads your dependencies (matching the semver/lockfile ideas in
[`general_programming_resources/05_dependency_management`](../../general_programming_resources/05_dependency_management/concept.md)),
compiles your code, and packages the result into whatever shape the target platform expects. Most build tools also expect your project to follow a specific folder layout and a specific entry point — this is **convention over configuration**: the tool doesn't have to ask "where's your code, and how do I start it?" because the answer is fixed in advance, the same idea
[`general_programming_resources/03_file_project_structure`](../../general_programming_resources/03_file_project_structure/concept.md)
covers generally as "a project's layout is a map of its intent."

**Deploying** is a distinct, second idea layered on top of "build": pushing a built artifact to a separate machine you don't directly develop on, instead of just running it locally where you built it. This shows up everywhere in software with completely different vocabulary for the same shape of problem — a web app deployed to a cloud server, a mobile app installed onto a phone, firmware flashed onto an embedded device. Deploying to a genuinely different, resource-constrained machine than the one you developed on is also exactly the general shape
[`ml_resources/edge_computing_primer/03`](../../ml_resources/edge_computing_primer/03-deployment-pipeline.md)
covers for a trained model: build it in one environment, package it for a different target, and ship it there.

## 2. What This Looks Like in FRC

WPILib's build tool is **GradleRIO** (current as of the 2026 season) — a plugin on top of standard [Gradle](https://gradle.org/) that adds FRC-specific behavior: cross-compiling and packaging your code for the roboRIO/Systemcore's ARM-based target instead of just the laptop you're building on, and a `deploy` task that pushes the result there over the network.

### The project layout GradleRIO expects

Every WPILib Java project follows the same fixed shape:

```text
your-robot-project/
├── build.gradle              GradleRIO plugin, team number, dependencies (see below)
├── settings.gradle           Just names the project
├── vendordeps/                One JSON file per vendor library (REVLib, Phoenix6, ...)
└── src/main/java/frc/robot/
    ├── Main.java              Entry point -- almost never edited
    ├── Robot.java             extends TimedRobot; wires the CommandScheduler into WPILib's own periodic loop
    ├── RobotContainer.java    Owns every subsystem, binds controller buttons to commands, exposes the auto routine
    ├── Constants.java         Centralized constants -- the exact pattern from
    │                          back_end_resources/systems_primer/09_configuration_constants_management
    ├── subsystems/            One class per physical mechanism (extends SubsystemBase)
    └── commands/               One class per unit of behavior (implements Command)
```

This isn't an arbitrary convention a team could reorganize if they wanted to — `frc.robot.Main` and the `TimedRobot` subclass it starts are exactly what GradleRIO's build output and the roboRIO's/Systemcore's own launcher expect to find. `07_project_scaffold_and_deploy/project/` in this folder is a small, fully annotated reference version of this exact layout — read `project/README.md` first, then walk through its files in the order listed above. It reuses `IntakeConstants.INTAKE_POWER = 0.65` directly from `systems_primer/09`'s `Constants.java` on purpose, so you can see the same centralized-constants pattern land in a real project shape instead of a standalone demo.

### `build.gradle`, briefly

The parts of `project/build.gradle` worth understanding on a first read, in the order they appear in the file:

- **`id "edu.wpi.first.GradleRIO" version "2026.1.1"`** — the plugin itself, version-tagged the same way every tool in this folder is (see the convention at the bottom of the top-level `frc_resources/README.md`). This version has to track the current season's WPILib release; an old GradleRIO version against a new roboRIO/Systemcore image (or vice versa) is a common source of deploy failures that look like something else entirely.
- **`frc { teamNumber = 1515 }`** — how `./gradlew deploy` (below) knows which physical robot on the network is "ours."
- **`deploy { targets { roborio(...) } }`** — the cross-compilation/packaging step from §1, made concrete: this is what actually produces an artifact meant to run on the roboRIO/Systemcore's Linux, not on the laptop doing the building.
- **`dependencies { ... }`** — `wpi.java.deps.wpilib()` and `wpi.java.vendor.java()` pull in WPILib itself and every vendor library declared under `vendordeps/`, resolved and cached the same way any other build tool resolves dependencies (`general_programming_resources/05_dependency_management`).

### Vendor libraries (`vendordeps/`)

A **vendor library** (REVLib for REV hardware, Phoenix 6 for CTRE hardware — both named in `06_hardware_debugging`) ships as one JSON file per library, added through WPILib's own "Manage Vendor Libraries" tool rather than hand-written. A trimmed, annotated shape of one:

```jsonc
{
  "name": "REVLib",
  "version": "2026.0.0",
  "frcYear": "2026",                                  // vendordeps are re-checked/pinned per season
  "mavenUrls": ["https://maven.revrobotics.com/"],     // where the actual Java/JNI/C++ artifacts live
  "jsonUrl": "https://software-metadata.revrobotics.com/REVLib-2026.json",  // where THIS FILE gets refreshed from
  "javaDependencies": [
    {"groupId": "com.revrobotics.frc", "artifactId": "REVLib-java", "version": "2026.0.0"}
  ]
}
```

The file itself just gets committed into `vendordeps/` in your project's git history — it's small, plain JSON, and reviewable in a PR like anything else. The actual library code it points to (`mavenUrls`) gets downloaded and cached separately, the first time you build after adding it.

### Pressing "Deploy"

The WPILib VS Code extension's Deploy command (or, directly, `./gradlew deploy` from a terminal — see `general_programming_resources/01_shell_cli_literacy` for what a wrapper script like `gradlew` actually is) does the following, in order:

1. **Build.** Compile and package the JAR, exactly like a normal `./gradlew build` would — this step fails or succeeds entirely on your laptop, before anything touches the robot.
2. **Connect.** Find the roboRIO/Systemcore on the network, by team-number-derived hostname (`roboRIO-1515-FRC.local`) or a direct IP, and open a connection to it.
3. **Copy.** Transfer the built JAR (and anything in `src/main/deploy`, for static files like autonomous-path JSONs) onto the target, replacing whatever was deployed there before.
4. **Restart robot code.** The roboRIO/Systemcore stops whatever program it was running and starts the new JAR — this is the process that, once it registers with the Driver Station, is what finally turns that "Robot Code" indicator green.

### When deploy fails

```text
`./gradlew deploy` doesn't finish cleanly
│
├─ Does the Gradle command itself report a build/compile error?
│   ├─ YES → nothing reached the robot yet. Fix the compile error like any other
│   │         Java build failure (general_programming_resources/06_debugging_methodology)
│   │         -- read the actual error, don't guess.
│   └─ NO  → build succeeded, but deploy still failed or "Robot Code" stays red
│             ├─ Can't find/connect to the robot at all?
│             │    → wiring/network layer: same "check the physical connection first"
│             │      instinct as 06_hardware_debugging SS1 -- wrong team number in
│             │      build.gradle, robot not powered/radio not up, or laptop on the
│             │      wrong network.
│             └─ Deploy reports success, but code never comes up green?
│                  → check the console/riolog output for a crash during robotInit()
│                    (a common cause: a vendor device constructed with the wrong
│                    CAN ID -- see 06_hardware_debugging's device-ID table pattern)
```

## 3. Where It Diverges From the General Case

The **six-week build season** (`01_frc_intro`) is, again, the underlying reason this folder's layout is fixed rather than left to each team's taste. A general software team can debate project structure for a day and lose little; an FRC programming subteam that spends part of its six weeks arguing about — or hand-rolling — its own build/deploy tooling is losing time it can't get back before ship date. GradleRIO's opinionated, identical-across-every-team layout means a mentor, a veteran from another team, or an online tutorial can look at *any* FRC Java project and immediately know where `Robot.java` and `Constants.java` live, without that team having made a single structural decision themselves.

**No-internet pits create a specific, easy-to-miss failure mode with vendor libraries.** `vendordeps/*.json`'s `jsonUrl` field exists so WPILib's tooling can *check for and fetch updates* to that library — but the underlying dependency artifacts themselves are cached locally (via the Gradle dependency cache) only after they've been successfully downloaded at least once, on a machine with internet. Adding a brand-new vendor library for the first time inside a venue with no usable internet (see `06_hardware_debugging` §3) will fail, even though the JSON file itself is already sitting in your git history — because the actual library code it points to has never been fetched and cached on that laptop. The practical rule this produces: add and build against any new vendor library well before ship date, on a network you trust, not as a last-minute pit fix.

**The `CommandBase` removal is this module's own version of the PathWeaver-to-Choreo shift `05_wpilib` describes.** Older WPILib versions had you extend an abstract `CommandBase` class to write a command; as of the 2024 season, `Command` became a plain interface with default (no-op) implementations for `initialize()`/`execute()`/`end()`, and `CommandBase` was removed entirely — `project/src/main/java/frc/robot/commands/RunIntakeCommand.java` in this folder uses the current `implements Command` form. If you copy an example from an older tutorial or forum post that still extends `CommandBase`, it won't compile against a current WPILib version — not because the *idea* changed, but because, like `05_wpilib`'s Pure-Pursuit-vs-PathPlanner point, FRC's tooling keeps moving underneath code that still describes the same underlying concept correctly.

## Resources

- [WPILib: Deploying Robot Code](https://docs.wpilib.org/en/stable/docs/software/vscode-overview/deploying-robot-code.html) — the official walkthrough of the Deploy button/`./gradlew deploy` process described in §2.
- [WPILib: Structuring a Command-Based Robot Project](https://docs.wpilib.org/en/stable/docs/software/commandbased/structuring-command-based-project.html) — the real convention behind the folder layout and `Constants.java` pattern shown above (also cited from `systems_primer/09`).
- [WPILib: Command-Based Programming](https://docs.wpilib.org/en/stable/docs/software/commandbased/index.html) — the conceptual coverage of `Subsystem`/`Command`/`CommandScheduler` this module gives a concrete project shape to; see also `frc_resources/05_wpilib`.
- [WPILib: Vendor Libraries](https://docs.wpilib.org/en/stable/docs/software/vscode-overview/3rd-party-libraries.html) — official docs on installing and managing the `vendordeps/*.json` files described in §2.
- [GradleRIO (GitHub)](https://github.com/wpilibsuite/GradleRIO) — the plugin's own source and release notes; the first place to check when a `build.gradle` block doesn't match what's described here.
- [WPILib: New for 2026 / Yearly Changelog](https://docs.wpilib.org/en/stable/docs/yearly-overview/yearly-changelog.html) — check here first each season for GradleRIO/Command API changes before re-teaching this module.
- [`general_programming_resources/05_dependency_management`](../../general_programming_resources/05_dependency_management/concept.md) — the general dependency-resolution ideas (lockfiles, semver, transitive risk) behind §2's `dependencies { }` block and vendordep discussion.

**Check for understanding / hands-on exercise suggestions:**
- Have each student clone (or open) our team's real robot code repository next to this module's `project/` reference skeleton and match every file in `project/` to its real counterpart, noting anything that's genuinely different between the two and why.
- Run a mock "first vendor library at competition" drill: pick a vendor library nobody on the team has added before, and time how long it takes from "add the vendordep" to "code that uses it actually builds," on a machine with internet — then discuss what that same attempt would have looked like in a no-internet pit.
- See `exercises/exercise-1-trace-a-deploy.md` for a guided walkthrough of tracing exactly what happens between pressing Deploy and the Driver Station showing "Robot Code."
