# 05 - Capstone: A Real Three-Language Pipeline

Every topic so far has taught one concept and shown you three separate implementations of it. This topic is different: it's one pipeline, where each language does the part it's actually good at and hands off to the next. This is, in miniature, exactly how tools like PhotonVision and Limelight are built, and exactly how a team that does its own vision/ML work would structure that code for real.

## The scenario

A coprocessor's camera sees a candidate object in a frame — some blob a simpler vision step (color thresholding, contour detection) has already isolated. We need to answer one question fast, every single frame: **is this actually a game piece, or is it noise** (a shadow, a piece of carpet, a reflection)? That answer then needs to reach the roboRIO in time to matter for whatever the driver or an autonomous routine is doing right now.

That single question gets answered by three different pieces of code, written in three different languages, each running on different hardware:

1. **Python, on a laptop, before the match.** We prototype and train a small classifier that takes a handful of numbers describing the blob (its width, height, aspect ratio, how much of its bounding box it actually fills) and predicts "game piece" or "not a game piece." This is exactly the `04b_python_intricacies` workflow — fast iteration, `numpy`-backed data, a `scikit-learn`/`PyTorch`-style training loop — except this time we export the trained model to a portable file format ([ONNX](https://onnx.ai/), Open Neural Network Exchange) instead of just reading the accuracy number and moving on.
2. **C++, on the coprocessor, during the match.** A small program loads that exported model once at startup, then runs inference on it continuously, once per candidate blob per frame, using the [ONNX Runtime](https://onnxruntime.ai/) C++ library. This is where `04a_cpp_intricacies` pays off directly: this program needs to run in a small, predictable amount of time and memory, frame after frame, for an entire match, with no garbage-collector pause ever able to sneak in and blow a frame's time budget.
3. **Java, on the roboRIO, during the match.** The robot's actual command-based code needs to *do* something with the answer — drive toward the game piece, run an intake, or ignore a false positive. It doesn't need to know anything about ONNX, feature vectors, or neural networks; it just needs a label and a confidence value, the same way `02_oop_inheritance`'s `Subsystem`-style code only needed to know "this is a `Motor`," not which concrete motor controller it was.

## How the pieces actually connect

In a real robot, steps 2 and 3 above are bridged over the network using **NetworkTables** — a WPILib-provided publish/subscribe system that a coprocessor writes values into (a detected label, a confidence score, maybe a target's position) and that the roboRIO reads from, continuously, every loop iteration. This is precisely what PhotonVision and Limelight already do: their coprocessor software runs a vision + inference pipeline in C++ under the hood, and publishes results to NetworkTables for your Java robot code to consume like any other sensor reading.

This capstone doesn't wire up real NetworkTables — `05_capstone_pipeline/java/OrchestratorExample.java` simulates receiving a few frames' worth of results instead, so you can see the *decision logic* clearly, without the added complexity of standing up an actual network connection between two programs. The comments in that file point out exactly where a real integration would plug in NetworkTables instead of the simulated data.

## Why the model moves between file formats at all

The trained model itself needs to survive the handoff from step 1 to step 2 above, in a form neither language has to translate by hand. **ONNX** exists for exactly this: it's a standard file format for describing a trained model's structure and learned weights, independent of what framework or language trained it. `python_train.ipynb` trains a model with PyTorch and calls `torch.onnx.export(...)` to write it out as a `.onnx` file; `cpp/infer.cpp` loads that same file with ONNX Runtime's C++ API and runs it, without ever needing PyTorch, Python, or any part of the original training code installed on the coprocessor at all. The coprocessor only needs the exported model and a small, fast C++ program that knows how to run it — exactly the separation of concerns `00_why_three_languages` described from the very start of this curriculum.

## Putting it together

Work through this topic in order: `python_train.ipynb` first (it produces the `.onnx` file the next step depends on), then `cpp/infer.h`/`cpp/infer.cpp` (build and run it against that exported model), then `java/OrchestratorExample.java` (see how the result would actually be consumed on the robot). `README.md` in this folder ties all three pieces together with the exact commands to run each step and a diagram of how they'd map onto a real robot's hardware.
