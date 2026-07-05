# 04c - Java Intricacies: What Java Has Been Doing for You All Along

You just spent `04a_cpp_intricacies` learning to manually pair every `new` with a `delete`, and watching what happens when you forget one. Every `TalonMotor`, every `Motor[]`, every `HashMap` you've built in Java throughout this entire curriculum has never once needed a matching cleanup call from you. This topic is short on purpose: it's just naming the thing that's been quietly handling that for you the whole time, now that you have something (C++) to contrast it against.

## The JVM

Java code doesn't run directly on your computer's processor the way a compiled C++ binary does. Instead, `javac` compiles your `.java` files into an intermediate form called **bytecode**, and the **JVM** (Java Virtual Machine) is the program that actually runs that bytecode — interpreting it, and compiling the hot paths to real machine code on the fly (this is the "hybrid" compiled/interpreted behavior mentioned back in `00_why_three_languages`). Every object you create in Java lives on a heap that the JVM manages — you never choose "stack or heap" for a Java object the way you do in C++; the JVM decides for you.

## Garbage collection

Because the JVM controls that heap, it's also in a position to clean it up for you: the JVM periodically runs a **garbage collector (GC)** that finds every object nothing in your program can reach anymore (no variable, no field, no array still points to it) and reclaims that memory automatically. This is the entire reason Java has no `delete` keyword and no equivalent of a dangling pointer — you cannot free memory that's still in use, and you never have to remember to free memory once it's not, because you never call the function that frees it at all. `FaultStack` in `03_data_structures_algorithms` needed a hand-written destructor in C++ to avoid leaking its nodes; the exact same structure in Java (built with `ArrayDeque` in that topic's notebook) never needed one, because every node it stops referencing becomes GC-eligible automatically, without a single line of cleanup code.

This is real safety, and it comes at a real cost: garbage collection isn't free, and it isn't instantaneous. Somewhere, at some point the JVM decides on its own, it has to pause part of your program's execution to actually do the collection work — usually for a few milliseconds, occasionally more under memory pressure. For robot orchestration code running on WPILib's 20-millisecond loop, that's normally an acceptable cost with room to spare. For the low-latency inference work in `05_capstone_pipeline`, a multi-millisecond, JVM-scheduled pause you don't control is exactly the kind of unpredictability that pushes that work into C++ instead — this is the same tradeoff `04a_cpp_intricacies` described from the other side.

## Discussion questions

Work through these with a mentor or the rest of your subteam — there's no notebook exercise to submit, just think them through:

1. If Java never lets you choose when memory is freed, how would you even begin debugging a Java program that's slowly using more and more memory over time (a "memory leak," even without a `delete` keyword to forget)? What would still have to be true about your code for that to happen?
2. `04a_cpp_intricacies` argued C++'s manual memory management matters for edge inference because of predictable timing and a tight memory budget. Robot orchestration code (Java, on the roboRIO) also runs on constrained hardware with a real time budget. Why does the tradeoff come out differently for that code than it does for the inference pipeline?
3. Every `Motor` object in `02_oop_inheritance`'s Java notebook is heap-allocated by the JVM, yet nothing in that notebook ever looks like C++'s pointers or references from that same topic. What is the JVM doing on your behalf, every time you write `Motor motor = new TalonMotor(...)`, that C++ makes you do by hand instead?
