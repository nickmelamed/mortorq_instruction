# Backend Systems Primer

This curriculum follows `language_primer` (Java, Python, and C++ fundamentals). That primer taught you to *write* code; this one teaches you to write code that keeps working once it's live, on a real robot, in a real match, with no pause button. Start with `00_intro/concept.md` if you haven't already.

## How this primer is organized

Where `language_primer` taught one concept and showed it in all three languages, this primer teaches **backend system patterns and behavior** — concurrency, communication, state, testing, reliability — using whichever language actually fits each concept, instead of forcing a three-language split onto topics that don't naturally have one. Most examples are Java, since that's what runs on the real robot via WPILib; a few pull in C++ or Python where the concept genuinely lives there instead (serialization at a coprocessor boundary, a quick REST example).

Each topic has:

- **`concept.md`** — the idea itself, explained through competition scenarios, with minimal code. Read this first.
- **Implementation examples**, in whichever language(s) fit — standalone, runnable/compilable files with mocked or simulated inputs where real hardware isn't available, commented generously since these are teaching examples, not production code.

## Directory structure

```text
systems_primer/
├── 00_intro/                              Why this primer exists, and what "surviving a match" means
├── 01_concurrency_realtime_loops/         WPILib's periodic loop, blocking calls, threads/races (just enough)
├── 02_communication_serialization/        CAN/serial/NetworkTables, and JSON as a shared format across them
├── 03_state_machines/                     States, transitions, events -- applied to an autonomous routine
├── 04_control_loops_pid/                  PID/feedforward as a "poll -> decide -> act" backend pattern
├── 04b_motion_control_and_trajectories/   Open-loop vs. closed-loop, motion profiling, Pure Pursuit, odometry/drift
├── 05_apis_networking/                    HTTP/REST, lightly -- a bridge to the frontend unit
├── 06_testing_debugging/                  Unit testing and WPILib-style simulation, without hardware
├── 07_logging_observability/               Structured logging, applied to 03's state machine
├── 08_error_handling_fault_tolerance/     Defensive patterns for sensor/network failures mid-match
├── 09_configuration_constants_management/ Centralized constants, and a practice-bot/comp-bot config pattern
└── README.md                              This file
```

## Suggested order

Work through `00` through `08` in numeric order — they build on shared context. `04b_motion_control_and_trajectories` sits between `04` and `05`: it leans directly on `04`'s PID and `01`'s periodic loop, and is itself leaned on by `ml_resources/perception_primer/05-objects-in-motion.ipynb`'s odometry/drift discussion. In particular, `03_state_machines`'s `AutonomousStateMachine.java` gets reused directly in `06_testing_debugging` (unit-tested and simulation-tested) and again in `07_logging_observability` (wrapped with structured logging), so it's worth understanding that file well before moving past it. `09_configuration_constants_management` is standalone and can wait until last.

## What this primer intentionally leaves out

- **Git and version control** has its own dedicated unit.
- **Dependency management and documentation practices** live in `general_programming_resources` (`05_dependency_management`, `04_documentation`) — they apply to frontend work just as much as backend work.
- **Deep networking and hardware communication** (sockets, the details of CAN/serial protocols) belong to a separate, larger networking/hardware unit. `05_apis_networking` only touches networking at the conceptual level, as a bridge to the frontend unit.

## Setup notes

- **Java files** compile and run standalone with a plain JDK (`javac`/`java`) — no WPILib project or build tool required. A few files in `06_testing_debugging` and `07_logging_observability` import `AutonomousStateMachine` from `03_state_machines/java` directly rather than duplicating it; see each topic's `concept.md` for the exact compile commands. `06_testing_debugging/java/ExampleUnitTest.java` additionally needs JUnit 4 (`junit-4.13.2.jar`) and Hamcrest (`hamcrest-core-1.3.jar`) on the classpath.
- **C++ files** (`02_communication_serialization/cpp`) need a C++17-capable compiler (`g++` or `clang++`) and `make`, with no external library dependencies.
- **The Python notebook** (`05_apis_networking/python/simple_server.ipynb`) runs on a standard Jupyter Python 3 kernel with `flask` and `requests` installed (`pip install flask requests`).
