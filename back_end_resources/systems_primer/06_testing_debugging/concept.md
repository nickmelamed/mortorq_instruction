# 06 - Testing and Debugging

## Why testing matters more here than in most software

Most software can ship a bug, notice it from user reports, and patch it. A competition robot doesn't get that luxury: once a match starts, whatever your code does is what happens, for the whole match, in front of everyone, with no chance to pause and fix anything. Every bug you didn't catch before the match is now everyone's problem, live. That's the entire argument for testing in this context: it's not about code quality for its own sake, it's about moving as many failures as possible from "during a match" to "on a laptop, days before."

## Unit testing, briefly

A **unit test** calls a small, specific piece of your code directly and checks that it behaves the way you expect, without needing a whole robot, a whole match, or even hardware to be involved at all. `06_testing_debugging/java/ExampleUnitTest.java` writes unit tests (using JUnit, a standard Java testing framework) against `03_state_machines/java/AutonomousStateMachine.java`: does the state machine start in `INTAKE`? Does it actually reach `TRANSPORT` after enough ticks? Does it eventually settle in `IDLE` and stay there? Each of these is a small, fast, independently-checkable claim about behavior you already wrote — exactly the kind of thing you want confirmed *before* that state machine ever runs during a real autonomous period.

## WPILib simulation: testing without hardware

Unit tests are great for testing pure logic (a state machine's transitions, a PID controller's math) in isolation. But some robot code only really means anything in the context of a subsystem, a robot loop, sensors, motors. WPILib's **simulation framework** lets you run that code against simulated hardware — a simulated motor, a simulated sensor reading whatever the simulated motor would produce — entirely on a laptop, no robot required. This is how a team validates a full autonomous routine (does it actually finish the intake-transport-score sequence, end to end, in a reasonable number of ticks?) before ever trusting it to run for real, and it's dramatically faster to iterate on: a simulated match doesn't need to wait out real wall-clock time tick by tick, since there's no real hardware it needs to stay in sync with.

`java/SimTestDemo.java` shows the shape of this: it runs the full `AutonomousStateMachine` from `03_state_machines`, tick by tick, entirely in code — no `Thread.sleep`, no real robot loop, no hardware — and checks whether it reaches the expected final state within an expected number of ticks. This isn't WPILib's actual simulation GUI/hardware-simulation layer (that needs a full WPILib project to demonstrate), but it's the same underlying idea: exercise real robot logic against a stand-in for hardware, fast, before trusting it on the field.

## Running these demos

Both files import `AutonomousStateMachine` from `03_state_machines/java` directly, rather than duplicating it — the whole point of this topic is testing code you already wrote, not a fresh copy of it.

`SimTestDemo.java` has no dependencies beyond the JDK:

```text
$ cd java
$ javac -d bin SimTestDemo.java ../../03_state_machines/java/AutonomousStateMachine.java
$ java -cp bin SimTestDemo
```

`ExampleUnitTest.java` needs JUnit 4 (`junit-4.13.2.jar`) and Hamcrest (`hamcrest-core-1.3.jar`) on the classpath — available from Maven Central, or already on your classpath if you're using a build tool like Gradle or Maven:

```text
$ cd java
$ javac -cp junit-4.13.2.jar:hamcrest-core-1.3.jar -d bin ExampleUnitTest.java ../../03_state_machines/java/AutonomousStateMachine.java
$ java -cp bin:junit-4.13.2.jar:hamcrest-core-1.3.jar org.junit.runner.JUnitCore ExampleUnitTest
```
