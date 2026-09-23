# 07 - Logging and Observability

## Mystery Bugs (That you Can't Reproduce)

Every team eventually loses a match to a bug nobody can explain (at least those that are built by students, anyways...). Without evidence from the moment it happened, you're guessing, because most of the time you can't make the error happen again (at least intentionally). Logging exists to remove guessing from that analysis entirely.

## What "Observability" Actually Means

**Observability** is the ability to understand what your robot actually did, and why, after the fact, without needing to reproduce the problem. It's the umbrella idea behind everything else in this module: structured logging (below) and driver station logs are how you get it in FRC, and "Logs Aren't Everything" further down covers the live-monitoring half of the same idea. A richer version of this same concept (logs, traces, and metrics as three distinct layers) gets full coverage in `ai_resources/agent_primer/09-observability.md`, for systems complex enough to need all three. A single robot's structured logs plus a live dashboard is enough to cover what FRC actually needs.

## Structured Logging vs. Scattered Prints

Every demo so far in this primer has used `System.out.println` freely, because printing is a fine way to see what's happening *while you're actively watching a program run*. It falls apart the moment you need to go back afterward and answer a specific question from a pile of scrolled-past text.

**Structured logging** fixes this by giving every log line the same consistent shape, instead of whatever text happened to seem useful in the moment:

- **Timestamp** — when, exactly, did this happen.
- **Level** — how serious is this: routine info, a warning, an error.
- **Message** — what happened, in plain language.
- **Relevant state** — the specific values that matter for understanding this event (which state you transitioned from and to, a sensor reading, an error code).

The payoff shows up when you have thousands of lines from an entire match and need to filter, search, or scan them afterward. A consistent shape is what makes that possible at all; scattered prints with no consistent structure just become an undifferentiated wall of text.

## Driver Station Logs

The FRC Driver Station application automatically records a log for every match and practice run: connection status, brownouts, code crashes, and anything your own code printed or logged during that run. This is frequently the *only* record of what happened during a specific match, especially for any problem that only shows up on the field and never reproduces in the pit. Knowing that this log exists, and making a habit of actually checking it after something goes wrong, is at least as valuable as any specific logging technique.

## Logs Aren't Everything

Well, this is a funny thing to say now, isn't it? 

Everything above is about a records you go back to after something has *already gone wrong*. That's a deliberately different job from a dashboard you glance at while the robot is still *running*. A drive coach mid-match doesn't have time to read a structured log line, and a detailed post-match log isn't built to be glanceable in half a second. Trying to serve both needs with one tool usually makes it worse at both jobs. FRC splits this into two purpose-built tools for exactly this reason: `frc_resources/05_dashboards_and_telemetry` covers Elastic (the live, driver-facing dashboard) and AdvantageScope (the log-replay/debugging tool) as the concrete FRC instance of the same live-vs-post-hoc distinction this module teaches in the abstract.

There's a third piece beyond "one log" and "one live dashboard": noticing a pattern *across* many matches, not just understanding one of them. The Driver Station's CAN/Power tab tracking brownout counts over a match, or comparing AdvantageScope logs from several matches to see if something's getting worse over a season, is FRC's version of the **metrics** layer `ai_resources/agent_primer/09-observability.md` describes. Its a shift from "what happened" to "is there a drift in my goal metrics". 

## Putting it Together

`java/StructuredLoggingDemo.java` reuses `03_state_machines/java/AutonomousStateMachine.java` directly — the same class `06_testing_debugging` unit-tested — and attaches a structured logger to its transition listener (the same publish/subscribe hook used throughout this primer). Instead of the state machine's own scattered `System.out.println` calls being your only record, every transition now produces one consistent, structured log line: timestamp, level, message, and the specific from/to states involved.

## Resources

- [WPILib: Driver Station Log File Viewer](https://docs.wpilib.org/en/stable/docs/software/driverstation/driver-station-log-viewer.html) - the official docs for the real log this unit's "Reading driver station logs" section describes.
- [Google SRE Book: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/) - Google's own writeup on why consistent, structured signals matter for finding out what actually happened, at a much larger scale than one robot.
- [Charity Majors: Live Your Best Life With Structured Events](https://charity.wtf/2022/08/15/live-your-best-life-with-structured-events/) - a well-known, opinionated blog post on why structured events beat scattered text logs, from one of the more prominent voices in observability engineering.
- `frc_resources/05_dashboards_and_telemetry` - the FRC-specific live-dashboard-vs-post-hoc-debugging split (Elastic vs. AdvantageScope) that this module's logging-vs-live-monitoring point maps onto directly.
