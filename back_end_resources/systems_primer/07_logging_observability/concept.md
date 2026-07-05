# 07 - Logging and Observability

## The mystery bug you can't reproduce

Every team eventually loses a match to a bug nobody can explain: the robot did something wrong, once, live, and by the time anyone looks at the code afterward, there's no way to know what actually happened at that moment. Was a sensor reading bad? Did a state machine transition at the wrong time? Did a network call to a coprocessor time out? Without evidence from the moment it happened, you're guessing. **Logging exists specifically to turn "we have no idea what happened" into "here's exactly what happened, in order, with the values involved."**

## Structured logging vs. scattered prints

Every demo so far in this primer has used `System.out.println` freely, because printing is a fine way to see what's happening *while you're actively watching a program run*. It falls apart the moment you need to go back afterward and answer a specific question from a pile of scrolled-past text: which tick did this happen on? What was the state right before it changed? Was this line even related to the bug, or just noise from something else printing at the same time?

**Structured logging** fixes this by giving every log line the same consistent shape, instead of whatever text happened to seem useful in the moment:

- **Timestamp** — when, exactly, did this happen.
- **Level** — how serious is this: routine info, a warning, an error.
- **Message** — what happened, in plain language.
- **Relevant state** — the specific values that matter for understanding this event (which state you transitioned from and to, a sensor reading, an error code).

The payoff isn't visible in a five-line demo — it shows up when you have thousands of lines from an entire match and need to filter, search, or scan them afterward. A consistent shape is what makes that possible at all; scattered prints with no consistent structure just become an undifferentiated wall of text once there's enough of it.

## Reading driver station logs

The FRC Driver Station application automatically records a log for every match and practice run: connection status, brownouts, code crashes, and anything your own code printed or logged during that run. This is frequently the *only* record of what happened during a specific match, especially for any problem that only shows up on the field and never reproduces on a bench. Knowing that this log exists, and making a habit of actually checking it after something goes wrong, is at least as valuable as any specific logging technique — the best logging code in the world doesn't help if nobody ever looks at what it recorded.

## Putting it together

`java/StructuredLoggingDemo.java` reuses `03_state_machines/java/AutonomousStateMachine.java` directly — the same class `06_testing_debugging` unit-tested — and attaches a structured logger to its transition listener (the same publish/subscribe hook used throughout this primer). Instead of the state machine's own scattered `System.out.println` calls being your only record, every transition now produces one consistent, structured log line: timestamp, level, message, and the specific from/to states involved.
