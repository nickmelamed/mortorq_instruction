# 05 - Capstone Pipeline: Train in Python, Infer in C++, Orchestrate in Java

Read `concept.md` first for the full explanation of what this pipeline is and why it's split across three languages this way. This file is the practical "how do I actually run all of this" reference.

## The pipeline, end to end

```text
 PYTHON (laptop, before the match)          C++ (coprocessor, during the match)         JAVA (roboRIO, during the match)
┌─────────────────────────────┐            ┌─────────────────────────────┐            ┌─────────────────────────────┐
│ python_train.ipynb           │            │ infer.cpp                    │            │ OrchestratorExample.java     │
│                               │            │                               │            │                               │
│ synthetic feature vectors    │  exports   │ loads detector.onnx once     │ publishes  │ reads label + confidence     │
│  -> train DetectorNet        │ ─────────► │ at startup, then classify()  │ ─────────► │  -> decides: intake? ignore?  │
│  -> torch.onnx.export(...)   │  cpp/      │ on each detected blob, every │ Network    │  -> commands the robot       │
│                               │ detector.  │ frame, for the whole match   │ Tables     │                               │
└─────────────────────────────┘  onnx       └─────────────────────────────┘ (simulated  └─────────────────────────────┘
                                                                              here)
```

This mirrors how PhotonVision and Limelight are actually built: a coprocessor runs a C++ (or similarly low-level) vision/inference pipeline and publishes results over NetworkTables, and your Java robot code consumes those results like any other sensor. This capstone doesn't stand up a real NetworkTables connection between two running programs — `java/OrchestratorExample.java` simulates receiving a few frames' worth of results instead, so the *decision logic* stays front and center. The comment at the top of that file shows exactly what the real NetworkTables-reading code would look like in its place.

## Running it yourself

**1. Train and export the model (Python).**

```text
$ jupyter notebook python_train.ipynb
```

Run every cell top to bottom. The last cells export `cpp/detector.onnx` and sanity-check it against the original PyTorch model. A copy of `detector.onnx` is already checked into `cpp/`, so you can skip straight to step 2 if you just want to see the pipeline run — but re-running this notebook and regenerating that file yourself is worth doing at least once.

**2. Build and run the C++ inference demo.**

Needs [ONNX Runtime](https://onnxruntime.ai/) installed. On macOS with Homebrew:

```text
$ brew install onnxruntime
```

Then, from `cpp/`:

```text
$ make
$ ./infer_demo
```

This loads `detector.onnx` and classifies three hand-picked feature vectors (a clear game piece, clear noise, and an ambiguous case), printing the predicted label and confidence for each.

**3. Compile and run the Java orchestrator example.**

```text
$ cd java
$ javac OrchestratorExample.java
$ java OrchestratorExample
```

This simulates receiving the kind of results `infer_demo` just produced (plus one extra frame added specifically to show the "detected, but not confident enough to act" case, which none of `infer_demo`'s three vectors happens to trigger) and shows the decision logic a real `Subsystem`/`Command` would run in response — no WPILib project needed to see it work.

## How this maps onto a real robot

| This capstone | On a real robot |
|---|---|
| `python_train.ipynb`, run once on a laptop | Same — model training never happens on the robot itself |
| `cpp/detector.onnx`, checked into the repo | Deployed onto the coprocessor alongside the inference program |
| `cpp/infer.cpp`, run manually from a terminal | Runs continuously on the coprocessor (a Raspberry Pi, Orange Pi, etc.), once per camera frame, for the whole match |
| Simulated `DetectionResult` values in `OrchestratorExample.java` | Real values read from NetworkTables, published by the coprocessor every frame |
| `OrchestratorExample.main()` | A real `Command` or periodic `Subsystem` method, wired into your actual command-based robot code |

Every piece of this capstone is a simplified stand-in for a real piece of competition software. If your team ends up building actual vision/ML capability, this is the shape it will very likely take.
