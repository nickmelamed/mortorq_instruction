# Running these demos

Read `concept.md` first.

## Java: NetworkTables publish/subscribe

Standalone, no build tool or WPILib project needed:

```text
$ cd java
$ javac NetworkTablesDemo.java
$ java NetworkTablesDemo
```

## C++: serial and JSON serialization

No external dependencies -- just a C++17 compiler and `make`:

```text
$ cd cpp
$ make
$ ./serial_demo
$ ./json_serialize
```

`serial_demo` shows the outbound half of a simulated serial connection to a sensor. `json_serialize` builds a `DetectionResult` struct — the same shape of data `NetworkTablesDemo.java` published above, and the same shape the languages primer's capstone pipeline hands from C++ to Java — and serializes it to JSON by hand, so you can see exactly what crosses the wire.
