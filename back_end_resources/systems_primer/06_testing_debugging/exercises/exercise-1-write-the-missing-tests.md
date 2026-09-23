# Exercise 1: Write the Missing Tests

## Goal
`ExampleUnitTest.java` tests that `INTAKE` holds for at least 3 ticks and that the machine reaches `TRANSPORT` and eventually `IDLE`. It never checks two things a real team would actually care about: whether the machine stays *stable* once it's finished, and whether `TRANSPORT` holds for the right duration the same way `INTAKE` is tested. Write both missing tests yourself.

## Setup
Work in `06_testing_debugging/java/ExampleUnitTest.java`, testing `03_state_machines/java/AutonomousStateMachine.java`. Compile/run per `concept.md`'s exact commands (needs JUnit 4 + Hamcrest on the classpath).

## Steps
1. Read every existing `@Test` method in `ExampleUnitTest.java` and, for each one, write a one-sentence description of the specific claim it's checking (not what it does line by line, but what it's *asserting is true* about the robot's behavior).
   
2. Write a new test, `staysInTransportUntilScoringPositionReached`, that mirrors the existing `staysInIntakeUntilPieceDetected` test's shape: run `periodic()` enough ticks to enter `TRANSPORT` but one tick short of the number needed to leave it, and assert the state is still `TRANSPORT`. (Work out the exact tick count from `AutonomousStateMachine.java`'s constants, don't copy a number from the existing tests without deriving it.)
   
3. Write a second new test, `doesNotTransitionAgainAfterReachingIdle`, that runs well past the number of ticks needed to reach `IDLE` (say, 25 ticks instead of 14) and asserts the transition-listener count is still exactly 3 (i.e., that the machine doesn't keep firing transitions once it's idle).
   
4. Run the full suite (all five original tests plus your two new ones) and confirm everything passes. Then, temporarily break `AutonomousStateMachine.java`'s `IDLE` case (e.g. make it fall through into `transitionTo(State.INTAKE)` instead of doing nothing) and rerun. Confirm your `doesNotTransitionAgainAfterReachingIdle` test is the one that catches it, then revert your change.

## Self-Check
- [ ] I described each existing test's claim, not just its mechanics
- [ ] `staysInTransportUntilScoringPositionReached` uses a tick count I derived from the constants, and it passes
- [ ] `doesNotTransitionAgainAfterReachingIdle` passes against the real file, and I confirmed it correctly fails when I broke `IDLE`'s behavior on purpose
- [ ] I reverted my deliberate break to `AutonomousStateMachine.java` before finishing

## Reflection
A test suite that only checks "does the happy path eventually get somewhere reasonable" misses an entire category of real bugs: things that are subtly *still running* when they should have stopped. `doesNotTransitionAgainAfterReachingIdle` is that second category. An autonomous routine that quietly loops back into `INTAKE` near the end of the 15-second auto period instead of holding still, before it ever reached a field, would be a bad bug to deal with.
