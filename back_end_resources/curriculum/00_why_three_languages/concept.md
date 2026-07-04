# 00 - Why Three Languages?

If you've been on the programming team for a season or two, you've probably only ever touched Java. That's normal — WPILib and the command-based framework are built around it, and it's genuinely a good fit for running a robot. So why does this curriculum also cover Python and C++?

Because a competitive FRC software stack isn't one program anymore. It's three, each doing a job the others are bad at.

## The three roles

**Java runs the robot.** Every subsystem, command, and button binding on the roboRIO is Java talking to WPILib. Java's job is orchestration: reading joystick input, sequencing autonomous routines, and talking to motor controllers over CAN. It doesn't need to be blazingly fast: it needs to be organized, safe, and easy for a whole subteam of students to read and extend without stepping on each other's code. That's what command-based architecture is for, and it's why Java (a mature, heavily-tooled, safety-net-having language) is the right choice here.

**Python trains the models.** If you do any machine learning (a vision model that recognizes game pieces, a classifier that tells alliance-colored objects apart, anything with a training loop) that work almost never happens in Java or C++. It happens in Python, because the entire ML research world lives there first. Python's job is prototyping: try an idea, look at the data, retrain, repeat, fast. You are not going to run this training loop on the robot. You are going to run it on a laptop, produce a trained model, and hand that model off to something else to actually use during a match.

**C++ runs inference at the edge.** "The edge" means hardware bolted to the robot that isn't the roboRIO: a coprocessor like a Raspberry Pi or Orange Pi, often paired with a camera, running a vision pipeline (this is what tools like PhotonVision and Limelight are actually doing under the hood). That coprocessor needs to take a camera frame, run it through the model Python trained, and produce an answer — "here's the AprilTag, here's its position" — in single-digit milliseconds, every frame, forever, without ever pausing. C++ is what you reach for when milliseconds and memory footprint actually matter, because it gives you direct control over both in a way Java and Python don't. That's why the vision libraries these tools lean on under the hood — OpenCV, AprilTag detection — are themselves written in C++, even when a tool's outer layer (PhotonVision's pipeline code, for instance) is Java.

Put together: Python is where the model is *born*, C++ is where it *runs fast*, and Java is where the robot *decides what to do* with the answer.

## Two ideas you'll need later

You don't need to master these yet, just recognize the words when they show up again in later topics.

**Compiled vs. interpreted.** A compiled language (C++) is translated into machine code by a compiler *before* you ever run it — you get an executable file that the computer runs directly, with no translation happening at runtime. An interpreted language (Python) is read and executed line-by-line by another program (the interpreter) *while it's running*. Java is a hybrid: it's compiled to an intermediate form (bytecode) ahead of time, and then the JVM interprets/just-in-time-compiles that bytecode at runtime. This distinction is why C++ programs generally start faster and run faster with more predictable timing; there's no interpreter sitting in the middle at runtime. It's also why Python is more forgiving to experiment in - there's no separate compile step between changing your code and running it.

**Static vs. dynamic typing.** In a statically typed language (Java, C++), every variable's type is fixed and checked *before* the program ever runs — if you try to put text into a variable declared to hold a number, the compiler stops you before you can even build the program. In a dynamically typed language (Python), a variable's type is only checked *while the program is running*, and the same variable can hold a number at one moment and text the next. Static typing catches a whole category of mistakes early and makes large codebases (like a season's worth of robot code) easier to maintain; dynamic typing makes quick experimentation (like trying out an idea in a training notebook) faster to write.

Keep both distinctions in mind as you move through the next few topics, and you will begin to understand why each language looks the way it does. 
