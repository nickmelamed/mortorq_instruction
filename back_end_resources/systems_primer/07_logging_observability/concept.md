# 07 - Logging and Observability

## The mystery bug you can't reproduce

Every team eventually loses a match to a bug nobody can explain (at least those that are built by students, anyways...). Without evidence from the moment it happened, you're guessing. Logging exists to remove guessing from that analysis entirely.

## Structured logging vs. scattered prints

Every demo so far in this primer has used `System.out.println` freely, because printing is a fine way to see what's happening *while you're actively watching a program run*. It falls apart the moment you need to go back afterward and answer a specific question from a pile of scrolled-past text.

**Structured logging** fixes this by giving every log line the same consistent shape, instead of whatever text happened to seem useful in the moment:

- **Timestamp** — when, exactly, did this happen.
- **Level** — how serious is this: routine info, a warning, an error.
- **Message** — what happened, in plain language.
- **Relevant state** — the specific values that matter for understanding this event (which state you transitioned from and to, a sensor reading, an error code).

The payoff shows up when you have thousands of lines from an entire match and need to filter, search, or scan them afterward. A consistent shape is what makes that possible at all; scattered prints with no consistent structure just become an undifferentiated wall of text once there's enough of it.

## Reading driver station logs

The FRC Driver Station application automatically records a log for every match and practice run: connection status, brownouts, code crashes, and anything your own code printed or logged during that run. This is frequently the *only* record of what happened during a specific match, especially for any problem that only shows up on the field and never reproduces on a bench. Knowing that this log exists, and making a habit of actually checking it after something goes wrong, is at least as valuable as any specific logging technique; the best logging code in the world doesn't help if nobody ever looks at what it recorded.

## Putting it together

`java/StructuredLoggingDemo.java` reuses `03_state_machines/java/AutonomousStateMachine.java` directly — the same class `06_testing_debugging` unit-tested — and attaches a structured logger to its transition listener (the same publish/subscribe hook used throughout this primer). Instead of the state machine's own scattered `System.out.println` calls being your only record, every transition now produces one consistent, structured log line: timestamp, level, message, and the specific from/to states involved.

## Resources

- [WPILib: Driver Station Log File Viewer](https://docs.wpilib.org/en/stable/docs/software/driverstation/driver-station-log-viewer.html) - the official docs for the real log this unit's "Reading driver station logs" section describes.
- [Google SRE Book: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/) - Google's own writeup on why consistent, structured signals matter for finding out what actually happened, at a much larger scale than one robot.
- [Charity Majors: Live Your Best Life With Structured Events](https://charity.wtf/2022/08/15/live-your-best-life-with-structured-events/) - a well-known, opinionated blog post on why structured events beat scattered text logs, from one of the more prominent voices in observability engineering.
