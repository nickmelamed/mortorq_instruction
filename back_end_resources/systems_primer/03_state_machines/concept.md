# 03 - State Machines

## States, Transitions, and Events

A **state machine** models something that's always in exactly one of a fixed set of named conditions (**states**), and moves between them only in response to specific **events**, following rules you define ahead of time (**transitions**). At any given moment, you can always answer "what is this thing doing right now?" with just the current state instead of reasoning through a pile of booleans and hoping they're all still consistent with each other.

That last part is the actual problem state machines solve. Without one, "what is the robot doing during auto?" tends to get represented with something like `boolean isIntaking, hasPiece, isScoring, isDone` — four independent flags that are supposed to always represent one sensible combination, but nothing stops them from drifting out of sync (what does `isIntaking = true` and `isScoring = true` at the same time even mean?). A state machine makes "exactly one thing is true at a time" structural instead of hoped-for.

Concretely, the four-boolean version looks like this:

```java
boolean isIntaking = false;
boolean hasPiece = false;
boolean isScoring = false;
boolean isDone = false;
```

Nothing here stops `isIntaking` and `isScoring` from both being `true` at once, or all four being `false` at the same time. These are combinations that don't correspond to anything the robot could sensibly be doing, but that nothing in this code rules out. Whether they stay in a sensible combination depends entirely on every piece of code that touches them remembering to update all four correctly, forever. Naturally, that's pretty confusing and needlessly difficult. 

The state-machine alternative replaces all four flags with a single variable, of a type that can only ever hold one of a fixed set of named values:

```java
enum State { INTAKE, TRANSPORT, SCORE, IDLE }
State currentState = State.INTAKE;
```

`currentState` can be exactly one of those four values, because that's what an `enum` type *is*. The invalid combinations above aren't just avoided by convention anymore; they're impossible to represent in the first place. 

It is this exact logic that motivates this module. 

## State Machines for Autonomous Routines

A simple autonomous routine could look like this: pick up a game piece, carry it, score it, then wait. This naturally translates to four states: 

```text
Intake -> Transport -> Score -> Idle
```

- **Intake**: run the intake mechanism until a sensor confirms a piece is held.
- **Transport**: drive to the scoring position.
- **Score**: run the scoring mechanism until the piece is released.
- **Idle**: nothing left to do; hold position.

Each state has its own "what do I do every tick while I'm here" logic, and its own rule for "what event moves me to the next state." `Intake` stays `Intake` until its sensor fires, then moves to `Transport`; `Transport` stays `Transport` until the robot's position reaches the scoring location, then moves to `Score`; and so on. Nothing about `Score`'s logic needs to know or care what happened during `Intake`; it just needs to know it's currently in the `Score` state.

```text
        piece detected           at scoring position         piece released
   +----------+  ------------>  +-----------+  ------------>  +---------+  ------------>  +--------+
   |  INTAKE  |                 | TRANSPORT |                 |  SCORE  |                 |  IDLE  |
   +----------+                 +-----------+                 +---------+                 +--------+
   run intake motor,            drive toward                  run scoring                  hold
   watch for a piece            scoring position               mechanism                   position

   Exactly one box is "current" at any tick. The arrow above each transition is the
   only thing that can move the machine forward. There's no path backward, and no
   way to be in two boxes (or zero boxes) at once.
```

Every trigger here is internal, because its a sensor on the robot itself. `ml_resources/perception_primer/08-decision-making.ipynb` builds the same pattern pointed at an external, vision-driven trigger instead: a state machine for a vision-assisted auto-align behavior, engaging and disengaging based on AprilTag detection confidence rather than an onboard sensor. 

This logic also maps directly onto WPILib's periodic loop model from `01_concurrency_realtime_loops`: a state machine's "run current state's logic, then check if it's time to transition" step is exactly the kind of fast, bounded work that belongs inside a `periodic()` method, called once per tick.

## Not Just for FRC

The exact same shape shows up all over general backend software, described in completely different words: an e-commerce order moving through `Placed -> Paid -> Shipped -> Delivered`, a support ticket moving through `Open -> InProgress -> Resolved -> Closed`, a video upload moving through `Uploading -> Processing -> Ready -> Failed`. Every one of these is states, events, and transitions between them, exactly like the autonomous routine above. If you learn to recognize "this is secretly a state machine" here, you'll keep noticing it in every backend system. 

## State Machines vs. Command-Based Programming

If you look at real FRC codebases, you'll notice most teams don't actually write `switch` statements over an enum to structure autonomous or teleop behavior. They use **command-based programming**, which is WPILib's own architecture, built around two ideas. A **`Subsystem`** owns a piece of hardware (a drivetrain, an intake, an arm) and exposes what it can do. A **`Command`** is one unit of behavior with a defined lifecycle (`initialize()` once at the start, `execute()` every tick while it runs, `isFinished()` checked every tick to know when to stop, `end()` once when it does) that runs against one or more subsystems. A **`CommandScheduler`** runs in the background, deciding which commands are currently active and calling their lifecycle methods, tick after tick. You don't write that loop yourself. We touch on this topic in `01_concurrency_realtime_loops`, so go back there if this isn't sounding familiar. 

The two approaches are solving related but distinct problems, and it's worth being explicit about the difference instead of treating them as interchangeable:

- A hand-rolled state machine, like `AutonomousStateMachine.java`, models one linear sequence: exactly one state active at a time, for one connected piece of behavior. It's a good fit when the logic really is one sequence, when the transition rules are specific enough that they don't obviously decompose into separate reusable pieces, and when you want the entire sequence readable top to bottom in one place, in one file.
- Command-based programming is built around composing independent, reusable units of behavior, potentially running concurrently across multiple subsystems at once.The same `Intake -> Transport -> Score -> Idle` routine, written command-based, would likely be four separate `Command` classes (`RunIntake`, `DriveToScoringPosition`, `RunScorer`, and an idle default) composed together with a `SequentialCommandGroup`, and each of those commands could potentially be reused elsewhere (the same `RunIntake` command bound to a driver's button in teleop, not just used inside this one autonomous routine). Command-based also gives you concurrency for free in a way a single enum-based state machine doesn't naturally express: a `ParallelCommandGroup` could have the drivetrain still driving while the arm simultaneously raises to scoring height, something that's awkward to model as "one state at a time."

The tradeoff is real for both. The hand-rolled state machine keeps everything about one sequence in one place, with total control over its transition logic, at the cost of not automatically getting reuse, concurrency, or the scheduler's built-in interruption/cancellation handling (what happens if a driver's button needs to safely cancel a command that's mid-execution). Command-based gets you all of that, at the cost of more moving pieces for something simple; a two-line transition rule can end up spread across a small `Command` class instead of one line in a `switch` statement, and reading the full shape of a sequence sometimes means reading through several nested command group classes instead of one file.

They aren't really mutually exclusive, either. A `CommandScheduler` is, underneath, managing exactly the same kind of thing a state machine manages: "what is currently running on this subsystem, and when does that change" is itself a state, tracked and transitioned by the scheduler on your behalf. Command-based programming is, in a real sense, state machine thinking with a framework built around composing and reusing the pieces. The examples in this primer stick with the plain enum version specifically because it's simpler to reason about as a generic pattern, and because it runs standalone with nothing beyond a JDK. There is no WPILib project required to see it work.

## Putting it together

`java/AutonomousStateMachine.java` implements the `Intake -> Transport -> Score -> Idle` routine as a Java `enum` (one value per state) with a `periodic()`-style update method that runs the current state's logic and checks whether it's time to transition. This same class gets reused directly in `07_logging_observability`, where its transitions get wrapped with structured logging, so it's worth understanding this file well before moving on.

## Resources

- [Game Programming Patterns: State](https://gameprogrammingpatterns.com/state.html) - a full chapter, free online, on the state pattern this unit's enum-based approach is a simplified version of.
- [Wikipedia: Finite-state machine](https://en.wikipedia.org/wiki/Finite-state_machine) - the formal definition and vocabulary behind states, transitions, and events.
- [WPILib Command-Based Programming](https://docs.wpilib.org/en/stable/docs/software/commandbased/index.html) - the real framework this unit's "vs. command-based programming" section contrasts against.
