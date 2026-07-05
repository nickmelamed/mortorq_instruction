# 04 - Control Loops (PID) as a Backend Pattern

## The shape underneath PID

Strip away the physics and the tuning theory for a moment, and a PID controller is doing something you've already seen twice in this primer: **poll a sensor, decide what to do based on the difference between what you have and what you want, act on that decision.** That's the same read-decide-write loop as `03_state_machines`'s `periodic()` method, running inside the same 20ms loop `01_concurrency_realtime_loops` described. PID isn't a separate, mysterious thing bolted onto robot code — it's this primer's core loop pattern, applied to a physical system that needs to *hit and hold* a specific target instead of just moving through a sequence of states.

That target might be an arm angle, a drivetrain heading, a flywheel's spin speed — anything where "close enough, eventually" isn't good enough and you need the system to actually converge on a number and stay there.

## What P, I, and D each respond to

A PID controller looks at **error** — the difference between where you want to be (the *setpoint*) and where you actually are (the current sensor reading) — and combines three terms, each reacting to a different aspect of that error, into one output value:

- **P (Proportional)** — react in proportion to how big the error is *right now*. Far from the target, push hard; close to the target, push gently.
- **I (Integral)** — react to how long and how consistently error has been building up over time, to correct small, persistent errors that P alone never quite eliminates.
- **D (Derivative)** — react to how fast the error is changing, to dampen overshoot instead of slamming into the target and oscillating past it.

You are not expected to become a PID tuning expert from this paragraph, or this topic. Actually tuning `kP`, `kI`, and `kD` for a real mechanism — what to change first, how to recognize oscillation versus sluggishness — belongs in a mechanical/controls-focused resource, not here. What you should walk away with is narrower: recognizing "read a sensor, compute an error, produce an output" as the same backend shape as everything else in this primer, just applied to a physical system instead of a data structure or a network message.

## Feedforward, briefly

**Feedforward** is a related idea worth knowing the name of: instead of waiting for error to show up and reacting to it (as P, I, and D all do), feedforward adds a term computed directly from what you already know about the system — "holding this arm up against gravity always needs at least this much output, regardless of current error." It's the difference between reacting after the fact and anticipating what you'll need before the error even appears. Real WPILib mechanism code frequently combines both: feedforward gets you close immediately, and PID cleans up whatever error is left.

## Putting it together

`java/PidLoopDemo.java` implements a minimal PID controller from scratch (mirroring the shape of WPILib's own `PIDController` class) and runs it against a simulated system: no real motor or sensor, just a mock value that responds to the controller's output a little bit each tick, so you can watch it converge toward a setpoint over time, print by print.
