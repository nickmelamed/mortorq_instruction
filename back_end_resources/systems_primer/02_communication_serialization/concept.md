# 02 - Communication and Serialization

A competition robot is not one program running in one place. It's several: code on the roboRIO, a driver station laptop running the FRC Driver Station application, and, on some teams, a coprocessor running vision or ML code, all talking to each other constantly, over several different channels, using several different formats. This topic is about those channels and formats — the robot's own internal "backend."

## Three channels, three jobs

**CAN bus** connects the roboRIO to motor controllers (Talons, Sparks, and similar) and some other devices. Every motor controller on the bus gets commands (set this power, hold this position) and reports status (current draw, temperature, encoder position) back, all over one shared physical bus. You'll mostly interact with CAN indirectly, through a motor controller's vendor library — you call `setPower(0.5)` in Java, and that library handles turning it into an actual CAN message.

**Serial** is a simpler, direct connection, commonly used for sensors or a coprocessor that isn't on the CAN bus at all — a straightforward stream of bytes between two devices, no shared bus, no addressing scheme. `cpp/serial_demo.cpp` shows the shape of a serial write.

**NetworkTables** is WPILib's own publish/subscribe system, and it's the one you'll touch most directly as an FRC programmer. One side publishes a value under a named key (say, `"detector/label"`); any number of other programs can subscribe to that same key and get the value, continuously, without the publisher needing to know who's listening or how many listeners there are. This is how the roboRIO and the driver station exchange data (joystick values going one way, telemetry going the other), and it's also exactly how a coprocessor running a vision pipeline — like the C++ inference program from the languages primer's capstone — hands its results to your Java robot code. `java/NetworkTablesDemo.java` shows the publish/subscribe pattern directly.

## Why serialization has to exist at all

CAN, serial, and NetworkTables all move raw bytes over a wire. Neither side automatically agrees on what those bytes *mean* — is this four bytes a single float, or four separate bytes, or part of a longer message? **Serialization** is the process of taking a structured piece of data your program understands (an object, a struct, a record) and converting it into a byte format both sides have agreed on ahead of time, so the receiving side can reverse the process (**deserialization**) and get back something structured and meaningful, not just a pile of bytes.

**JSON** (JavaScript Object Notation) is one common serialization format: human-readable text, structured as nested keys and values, widely supported across nearly every language. It's a good format to learn first because you can open it in a text editor and read it directly. Binary formats (like Protocol Buffers, or NetworkTables' own internal wire format) trade that readability for smaller size and faster parsing — worth knowing exists, not something you need to hand-roll yourself here.

## Tying this back to the capstone

Recall the languages primer's capstone pipeline: Python trains a model, C++ runs inference on a coprocessor, and Java orchestrates the result on the roboRIO. The `OrchestratorExample.java` in that capstone simulated receiving detection results directly, with a comment noting that a real version would read them from NetworkTables instead. This topic is that missing piece, made concrete: `cpp/json_serialize.cpp` serializes a detection result (a class label, a confidence score, an x/y position) to JSON — the exact shape of data that would need to cross from a C++ coprocessor to a Java robot in a real system, whether it travels as JSON over a socket, or as individual NetworkTables values the way `java/NetworkTablesDemo.java` demonstrates.

## Putting it together

`java/NetworkTablesDemo.java` demonstrates publish/subscribe using a simplified, in-memory stand-in for real NetworkTables (no live robot or driver station connection needed to run it — see its header comment for what the real API call looks like in its place). `cpp/serial_demo.cpp` shows a minimal simulated serial write. `cpp/json_serialize.cpp` builds and serializes a detection-result struct to JSON by hand, mirroring the exact data a vision coprocessor would need to hand off. Build the C++ files with `make` in `cpp/` — see that folder's `Makefile`.

## Resources

- [What is NetworkTables?](https://docs.wpilib.org/en/stable/docs/software/networktables/networktables-intro.html) - the official introduction to the real publish/subscribe system `NetworkTablesDemo.java` stands in for.
- [JSON](https://www.json.org/json-en.html) - the format's own reference site: a complete description of the syntax in about one page.
- [Protocol Buffers](https://protobuf.dev/) - the binary serialization format `concept.md` mentions as an alternative to JSON, from the team that built it.
