# 06 - Testing and Debugging

## Testing Matters (More with Robotics than Software)

Most software can ship a bug, notice it from user reports, and patch it. A competition robot doesn't get that luxury. Once a match starts, whatever your code does is what happens. That's the entire argument for testing in this context. It's about making sure we limit issues that shut down our robot in the middle of a match. 

## Unit Testing (Briefly)

A **unit test** calls a small, specific piece of your code directly and checks that it behaves the way you expect. `06_testing_debugging/java/ExampleUnitTest.java` writes unit tests (using JUnit, a standard Java testing framework) against `03_state_machines/java/AutonomousStateMachine.java`: does the state machine start in `INTAKE`? Does it actually reach `TRANSPORT` after enough ticks? Does it eventually settle in `IDLE` and stay there? Each of these is a small, fast, independently-checkable claim about behavior you already wrote.

## WPILib Simulation: Testing without Hardware

Unit tests are great for testing pure logic (a state machine's transitions, a PID controller's math) in isolation. But some robot code only really means anything in the context of a subsystem, a robot loop, sensors, and/or motors. WPILib's **simulation framework** lets you run that code against simulated hardware entirely on a laptop, no robot required. This is how a team validates a full autonomous routine before ever trusting it to run for real, and it's dramatically faster to iterate on: a simulated match doesn't need to wait out real wall-clock time tick by tick, since there's no real hardware it needs to stay in sync with.

`java/SimTestDemo.java` shows the shape of this: it runs the full `AutonomousStateMachine` from `03_state_machines`, tick by tick, entirely in code (no `Thread.sleep`, no real robot loop, no hardware) and checks whether it reaches the expected final state within an expected number of ticks. This isn't WPILib's actual simulation GUI/hardware-simulation layer (that needs a full WPILib project to demonstrate), but it's the same underlying idea: exercise real robot logic against a stand-in for hardware, fast, before trusting it on the field.

## Running The Demos

Both files import `AutonomousStateMachine` from `03_state_machines/java` directly, rather than duplicating it. The whole point of this topic is testing code you already wrote, not a fresh copy of it.

`SimTestDemo.java` has no dependencies beyond the JDK:

```text
$ cd java
$ javac -d bin SimTestDemo.java ../../03_state_machines/java/AutonomousStateMachine.java
$ java -cp bin SimTestDemo
```

`ExampleUnitTest.java` needs JUnit 4 (`junit-4.13.2.jar`) and Hamcrest (`hamcrest-core-1.3.jar`) on the classpath. This is available from Maven Central, or already on your classpath if you're using a build tool like Gradle or Maven:

```text
$ cd java
$ javac -cp junit-4.13.2.jar:hamcrest-core-1.3.jar -d bin ExampleUnitTest.java ../../03_state_machines/java/AutonomousStateMachine.java
$ java -cp bin:junit-4.13.2.jar:hamcrest-core-1.3.jar org.junit.runner.JUnitCore ExampleUnitTest
```

This unit teaches the *mechanics* of JUnit and WPILib simulation specifically. The underlying philosophy of what makes a test worth having at all, and a repeatable method for debugging any bug in any language, live in `general_programming_resources/07_testing_philosophy` and `general_programming_resources/06_debugging_methodology`.

These are also exactly the kind of tests worth running automatically on every push or PR, not just by hand before a match. See `frc_resources/08_project_scaffold_and_deploy` for how that fits into the rest of the build/deploy pipeline.

## Resources

- [JUnit 4](https://junit.org/junit4/) - the official site for the testing framework `ExampleUnitTest.java` uses.
- [WPILib: Introduction to Robot Simulation](https://docs.wpilib.org/en/stable/docs/software/wpilib-tools/robot-simulation/introduction.html) - the real simulation framework `SimTestDemo.java` is a simplified stand-in for.
- [Martin Fowler: Test Pyramid](https://martinfowler.com/bliki/TestPyramid.html) - why you want many fast, narrow tests (like this unit's) and far fewer slow, broad ones.
