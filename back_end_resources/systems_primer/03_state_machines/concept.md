# 03 - State Machines

## States, transitions, events

A **state machine** models something that's always in exactly one of a fixed set of named conditions (**states**), and moves between them only in response to specific **events**, following rules you define ahead of time (**transitions**). At any given moment, you can always answer "what is this thing doing right now?" with exactly one word — the current state — instead of reasoning through a pile of booleans and hoping they're all still consistent with each other.

That last part is the actual problem state machines solve. Without one, "what is the robot doing during auto?" tends to get represented with something like `boolean isIntaking, hasPiece, isScoring, isDone` — four independent flags that are supposed to always represent one sensible combination, but nothing stops them from drifting out of sync (what does `isIntaking = true` and `isScoring = true` at the same time even mean?). A state machine makes "exactly one thing is true at a time" structural instead of hoped-for.

## Applying it to autonomous

A simple autonomous routine — pick up a game piece, carry it, score it, then wait — is naturally four states:

```text
Intake -> Transport -> Score -> Idle
```

- **Intake**: run the intake mechanism until a sensor confirms a piece is held.
- **Transport**: drive to the scoring position.
- **Score**: run the scoring mechanism until the piece is released.
- **Idle**: nothing left to do; hold position.

Each state has its own "what do I do every tick while I'm here" logic, and its own rule for "what event moves me to the next state." `Intake` stays `Intake` until its sensor fires, then moves to `Transport`; `Transport` stays `Transport` until the robot's position reaches the scoring location, then moves to `Score`; and so on. Nothing about `Score`'s logic needs to know or care what happened during `Intake` — it just needs to know it's currently in the `Score` state.

This maps directly onto WPILib's periodic loop model from `01_concurrency_realtime_loops`: a state machine's "run current state's logic, then check if it's time to transition" step is exactly the kind of fast, bounded work that belongs inside a `periodic()` method, called once per tick.

## This isn't just an FRC pattern

The exact same shape shows up all over general backend software, described in completely different words: an e-commerce order moving through `Placed -> Paid -> Shipped -> Delivered`, a support ticket moving through `Open -> InProgress -> Resolved -> Closed`, a video upload moving through `Uploading -> Processing -> Ready -> Failed`. Every one of these is states, events, and transitions between them, exactly like the autonomous routine above. If you learn to recognize "this is secretly a state machine" here, you'll keep noticing it in every backend system you touch afterward, robot or not.

## Putting it together

`java/AutonomousStateMachine.java` implements the `Intake -> Transport -> Score -> Idle` routine as a Java `enum` (one value per state) with a `periodic()`-style update method that runs the current state's logic and checks whether it's time to transition. This same class gets reused directly in `07_logging_observability`, where its transitions get wrapped with structured logging — so it's worth understanding this file well before moving on.
