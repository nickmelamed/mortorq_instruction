# Back End Curriculum: Java, Python, and C++

This curriculum teaches the three languages our software stack actually uses: **Java** for robot orchestration (WPILib, command-based), **Python** for ML prototyping, and **C++** for low-latency inference on edge hardware. Start with `00_why_three_languages/concept.md` if you haven't already — it explains why we need all three instead of picking just one.

## How this curriculum is organized

Each numbered topic teaches one concept **once**, then shows you the real implementation in each language **in full**. We do this on purpose instead of showing three side-by-side translated snippets per concept: reading three snippets that all say the same thing in different fonts teaches you to translate, not to think in each language. So the pattern per topic is:

- **`concept.md`** — the idea itself, explained once, with no language-specific code. Read this first.
- **`java.ipynb`** / **`python.ipynb`** — a full, runnable notebook implementing the same example idiomatically in that language.
- **`cpp/`** — real, compilable `.cpp`/`.h` files and a working `Makefile`. C++ isn't a notebook language here, on purpose — you'll actually run `make` and get a binary, because that edit-compile-run loop is part of what you're learning.
- **`comparison.md`** — a syntax-only quick-reference table. Use it to look something up after you already understand the concept, not to learn the concept in the first place.

Topics `04a`/`04b`/`04c` break this pattern deliberately: each language's deeper idiosyncrasies (C++ memory management, Python's dynamic typing and ML ecosystem, Java's garbage collector) genuinely don't share a common concept, so those are per-language only.

## Directory structure

```text
curriculum/
├── 00_why_three_languages/
│   └── concept.md                  Why Java + Python + C++, and compiled/interpreted, static/dynamic typing
├── 01_basics/                      Variables, functions, types, control flow
├── 02_oop_inheritance/             Classes, inheritance, interfaces, polymorphism (+ pointers/references for C++)
├── 03_data_structures_algorithms/  Stacks, queues, hashmaps/dicts, Big-O
├── 04a_cpp_intricacies/            Stack vs. heap, RAII, smart pointers
├── 04b_python_intricacies/         Dynamic/duck typing, numpy/pandas, a minimal training loop
├── 04c_java_intricacies/           Garbage collection and the JVM, as a contrast point
├── 05_capstone_pipeline/           Train in Python -> infer in C++ -> orchestrate in Java
└── README.md                       This file
```

## Suggested order

Work through the topics in numeric order. `01`–`03` build on each other directly — in particular, `02_oop_inheritance` introduces just enough about C++ pointers and references to make polymorphism work, and `03_data_structures_algorithms` immediately puts that same pointer knowledge to use building a real linked structure. Don't skip `02`'s C++ section even if you find OOP itself easy — the pointer material is the part that matters for what comes next.

`04a`/`04b`/`04c` can be read in any order relative to each other, but assume you've finished `01`–`03`. `05_capstone_pipeline` assumes everything before it, since it's the topic that stitches all three languages together into one pipeline.

## Setup notes

- **Python notebooks** run on a standard Jupyter Python 3 kernel with `numpy`, `pandas`, `scikit-learn`, and `torch` available.
- **Java notebooks** run on the [IJava](https://github.com/SpencerPark/IJava) Jupyter kernel (a real JShell-backed JDK, not simulated Java) — you'll need a JDK installed and the IJava kernel registered with Jupyter to run them.
- **C++ files** need a C++17-capable compiler (`g++` or `clang++`) and `make`. `05_capstone_pipeline/cpp` additionally links against [ONNX Runtime](https://onnxruntime.ai/) — see that topic's `README.md` for install instructions.
- If you want to understand what `pip install` and similar setup commands are actually doing, see `general_programming_resources/05_dependency_management`.
