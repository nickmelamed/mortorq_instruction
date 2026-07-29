# 04 — Dashboards and Telemetry

## 1. The General Idea

Any complex running system benefits from two genuinely different kinds of visibility
into what it's doing, and they usually call for different tools:

- **Live operational monitoring** — a dashboard an operator glances at *while the
  system is running* to make in-the-moment decisions. This has to be fast, simple, and
  hard to misread under pressure — an operator doesn't have time to dig through raw data
  mid-operation.
- **Post-hoc debugging and analysis** — going back through detailed logs after the fact
  to understand *why* something happened. This tool can afford to be dense, detailed,
  and slower to use, because you're not racing a live system anymore — you're
  investigating.

Trying to serve both needs with one tool usually makes it worse at both jobs: a
dashboard detailed enough for deep debugging is too cluttered to glance at live, and a
live-monitoring view stripped down enough to be glanceable usually doesn't retain enough
detail for real post-hoc analysis.

## 2. What This Looks Like in FRC

FRC splits this into two separate, purpose-built tools:

- **Elastic** (current as of the 2026 season; WPILib shipped Elastic as the default
  dashboard starting with the 2026.0.0 release, and it's built by Team 353) is the
  **live, driver-facing competition dashboard** — the thing a drive coach glances at
  during a match. It shows current robot state: which auto routine is selected, sensor
  readouts relevant to driving, match timer, alerts. It's the direct successor to
  **Shuffleboard** and **SmartDashboard** (both deprecated; Shuffleboard is scheduled
  for removal in the 2027 season for lack of an active maintainer). Elastic added
  Systemcore support for 2026, tracking the hardware transition covered in
  `06_hardware_debugging`, §4.
- **AdvantageScope** (current as of the 2026 season) is the **debugging, log-replay, and
  3D-visualization tool**. It reads WPILib's own DataLog and Driver Station log file
  formats after a match (or live, during testing), and lets you scrub through a whole
  match's worth of recorded signals, plot them against each other, and even replay a
  match's tracked robot pose in a 3D field view — the kind of deep, slower-paced
  investigation that has no place on a driver's live dashboard.

## 3. Where It Diverges From the General Case

The live-vs-debugging split isn't just good practice here — it's forced by a hard FRC
constraint: **a driver station view that's too cluttered or slow to read during a match
is actively dangerous to competitive performance.** A drive coach has fractions of a
second to notice "climber sensor says we're not latched" during endgame; a dashboard
built to also support deep post-match analysis would bury that signal under everything
else it's tracking. Conversely, cramming AdvantageScope's replay/3D-visualization
feature set into a live driver view would make the live view slower and more fragile
exactly when it needs to be fastest and most reliable — mid-match, on competition wifi,
with a match clock running.

The Shuffleboard-to-Elastic transition is itself a live example of this split
hardening over time: Shuffleboard tried to be a general-purpose dashboard for both
live driving and general testing, and its removal in favor of Elastic (live-focused)
plus AdvantageScope (debugging-focused) is FRC's tooling formally separating the two
concerns the general principle in §1 says should be separated anyway.

## Resources

- [WPILib: Choosing a Dashboard](https://docs.wpilib.org/en/stable/docs/software/dashboards/dashboard-intro.html) — WPILib's own guidance on when to reach for which dashboard; check this each season, since the recommended default has changed (Shuffleboard → Elastic).
- [WPILib: Elastic](https://docs.wpilib.org/en/stable/docs/software/dashboards/elastic.html) — official Elastic documentation.
- [Elastic Documentation (GitBook)](https://frc-elastic.gitbook.io/docs) — the dashboard's own docs, maintained by Team 353.
- [AdvantageScope Documentation](https://docs.advantagescope.org/) — official docs for log replay, plotting, and 3D visualization.
- [WPILib: New for 2026 / Yearly Changelog](https://docs.wpilib.org/en/stable/docs/yearly-overview/yearly-changelog.html) — the authoritative source for what changed this season across dashboards and everything else in this folder; a good first stop before re-teaching any module here.

**Check for understanding / hands-on exercise suggestions:**
- Have students build a minimal Elastic layout for a practice robot (battery voltage, selected auto, one key sensor) and time how fast a new drive coach can read robot state off it at a glance — then compare that to trying to read the same information out of an AdvantageScope log view.
- Pull a real DataLog from a practice match into AdvantageScope and have students find the exact timestamp of a specific event (a brownout, a missed shot) using the replay/plotting tools — a good bridge exercise into `06_hardware_debugging`'s brownout diagnosis scenario.
