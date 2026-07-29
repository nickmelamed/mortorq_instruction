# frc_resources

A curriculum unit on FRC's specific tools and hardware ecosystem — Limelight, Roboflow,
dashboards/telemetry, WPILib, and CAN-bus hardware debugging. General ML/perception
concepts (what a neural network is, what a Kalman filter does, etc.) are covered
elsewhere in the curriculum; this unit is about how *FRC's* tools implement and
package those ideas, and where FRC's competition constraints make its version of a
tool diverge from the textbook version.

Written for a mixed audience: veterans who've been through other curriculum units, and
new recruits with no prior exposure. Nothing here assumes you were in the room for an
earlier conversation — if a module points to outside material for depth, it still
restates the core idea in a few sentences first.

## Modules

| Module | Covers |
|---|---|
| [01_frc_intro](01_frc_intro/README.md) | Match structure, scoring paradigms across seasons, alliance/elimination format, the six-week build season as a design constraint |
| [02_limelight](02_limelight/README.md) | Limelight as a smart camera, AprilTag pose estimation, onboard neural pipelines, vs. PhotonVision |
| [03_roboflow](03_roboflow/README.md) | Dataset labeling, augmentation, the active-learning loop, Roboflow → Limelight training pipeline |
| [04_dashboards_and_telemetry](04_dashboards_and_telemetry/README.md) | Elastic (driver dashboard) vs. AdvantageScope (debugging/log replay) — why FRC splits these into two tools |
| [05_wpilib](05_wpilib/README.md) | Command-based architecture, simulation, Choreo/PathPlanner path planning |
| [06_hardware_debugging](06_hardware_debugging/README.md) | CAN bus fundamentals, Phoenix Tuner X, REV Hardware Client, brownout diagnosis, the Systemcore transition |

> **Status:** `06_hardware_debugging` is the pilot module and is fully written. The
> others are stubs pending review of the pattern below.

## The pattern every module follows

Each module's `README.md` has three sections, in this order:

**1. The general idea.**
2-4 sentences, no FRC specifics — the underlying concept in its general form (e.g. "what
is a control loop," "what is a shared communication bus," "what is active learning in a
labeling workflow"). If a fuller treatment of the general concept already exists
elsewhere in this repo's curriculum, that module names it explicitly as a pointer for
further depth — but still restates the concept here in a few sentences, so this module
never depends on you having read something else first. If no such unit exists, this
section is original, self-contained content.

**2. What this looks like in FRC.**
The actual tool, hardware, or workflow FRC teams use. This is where you'll find concrete,
worked examples — a real device list, a real config screen, a real log trace — rather
than abstract description. The goal is to learn by looking at an actual instance of the
thing, not just reading about it.

**3. Where it diverges from the general case.**
The most important section in every module. FRC's version of a tool is never just "the
general concept, FRC-flavored" — some competition constraint (six-week build season,
no-internet pits, a specific rule in the game manual, a cost or weight limit) forces a
real design tradeoff. This section names that constraint and explains why it produces
the specific tool/workflow described in section 2.

### Two conventions that apply across every module

**Version everything.** FRC's tooling changes yearly, and its underlying control-system
hardware is mid-transition (see `06_hardware_debugging` for the Systemcore
note). Every specific tool, hardware component, or software version gets a season/year
tag — e.g. "As of the 2026 season, teams use the roboRIO 2 as the primary controller."
When the tech shifts, search for outdated year-tags to find what needs revision, rather
than re-reading every module from scratch.

**Cite official documentation.** Where possible, each module ends with a short
`## Resources` section linking the vendor's or WPILib's own docs, each with a one-line
note on why it's worth reaching for and when. Vendor docs are the source of truth and
change faster than this folder can track — treat this folder as the map and the official
docs as the territory.
