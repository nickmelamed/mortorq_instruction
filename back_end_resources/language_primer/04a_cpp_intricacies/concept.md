# 04a - C++ Intricacies: Memory Management

`03_data_structures_algorithms` had you write your first real `new`/`delete` pair to build `FaultStack`, with a promise to come back and explain what was actually going on. This is that explanation. Unlike Java and Python, C++ makes you decide, for every single object, exactly when it's created, where it lives in memory, and exactly when it's destroyed. This topic is about making that decision correctly and safely.

## Stack vs. heap

Every running C++ program has (at least) two regions of memory it uses for your objects:

**The stack** is where local variables normally live; the ones you declare directly, like `TalonMotor talon("Left Drive");` back in `02_oop_inheritance`. Stack memory is managed automatically and extremely cheaply: when a function is called, space for its local variables is reserved in one step; when the function returns, that space is reclaimed in one step, and every object in it is automatically destroyed on the way out. The catch is that a stack object's lifetime is tied rigidly to the scope it was declared in. It cannot outlive the function call that created it, and its size has to be knowable at compile time.

**The heap** is a much larger pool of memory that your program can request chunks of manually, at any time, in any amount, and hang onto for as long as it wants — independent of which function is currently running. This is exactly what `FaultStack` needed: a node pushed inside one function call has to survive until some *other*, later function call pops it. That requirement — "this object must outlive the scope that created it" — is the signal that you need the heap, not the stack.

The tradeoff: heap memory doesn't clean itself up. Nothing automatically destroys a heap object when you're done with it. You have to say so, explicitly.

## `new` and `delete`

`new` requests a chunk of heap memory, constructs an object in it, and gives you back a pointer to it. `delete` takes a pointer to a heap object, destroys the object, and returns that memory to the heap so it can be reused. Every `new` in a correct C++ program is matched by exactly one `delete` — miss one, and that memory is never reclaimed for the rest of the program's run (a **memory leak**); call `delete` twice on the same pointer, or use a pointer after deleting it, and the behavior is undefined and often crashes unpredictably, sometimes long after the actual mistake.

This is the real cost of manual memory management: it's powerful (you decide exactly what happens and when, with none of the overhead of an automatic system watching over everything), but the bookkeeping is now entirely your responsibility, and the failure modes when you get it wrong are severe. `memory_demo.cpp` in this folder walks through stack and heap allocation side by side so you can see the difference directly.

## RAII: tying cleanup to scope

**RAII** ("Resource Acquisition Is Initialization") is C++'s core pattern for making manual cleanup less error-prone: wrap a resource (heap memory, a file handle, a network connection — anything that needs explicit cleanup) inside an object, acquire the resource in that object's constructor, and release it in its destructor. Because C++ guarantees a stack object's destructor runs automatically when it goes out of scope — even if the function exits early, even if an exception is thrown partway through — wrapping a resource this way means cleanup happens automatically too, without you having to remember to call it at every possible exit point.

`FaultStack` in `03_data_structures_algorithms` is already a (small, informal) example of this idea: its destructor walks the linked list and `delete`s every node, so a `FaultStack` that goes out of scope cleans up all of its heap-allocated nodes by itself. RAII is what makes that guarantee dependable.

## Smart pointers: RAII for pointers themselves

The most common thing to wrap in RAII is a raw pointer itself. C++ provides ready-made types for exactly this, so you rarely need to write the wrapper by hand the way `FaultStack` did.

- **`std::unique_ptr`** owns a heap object exclusively — only one `unique_ptr` can point to a given object at a time (it can be *moved* to transfer ownership, but not copied). When the `unique_ptr` is destroyed, it automatically `delete`s what it owns. This is the right default for "I heap-allocated something and exactly one place is responsible for it."
- **`std::shared_ptr`** allows multiple pointers to jointly own the same heap object, tracking (via a reference count) how many `shared_ptr`s currently point to it. The object is automatically deleted only once the *last* `shared_ptr` to it is destroyed. Use this when genuinely multiple, independent parts of your program need to share ownership of the same object and none of them can be designated as "the one true owner."

Both eliminate the two most common raw-pointer bugs by construction: you cannot forget to `delete` (the smart pointer's destructor does it for you, via RAII), and you cannot accidentally use a `unique_ptr`'s object after ownership has moved elsewhere (the compiler stops you from copying it in the first place). `smart_pointers_demo.cpp` walks through the same task written first with raw pointers, then with `unique_ptr`, so you can see exactly what the smart pointer is buying you.

## Why this matters specifically for edge inference

This whole topic exists in this curriculum because of `05_capstone_pipeline`. A C++ program running inference on a coprocessor is expected to process camera frames continuously, in a tight, predictable time budget, for the entire length of a match, on hardware with a real memory ceiling. Two properties of manual memory management matter enormously in exactly that situation:

- **No garbage collector pauses.** Java's JVM (see `04c_java_intricacies`) periodically pauses your program to reclaim memory it can no longer reach — usually for a few milliseconds, occasionally longer. That's a rounding error for robot orchestration logic running on a 20ms loop with slack to spare. It is not a rounding error for a vision pipeline that needs to hand off a result within a few milliseconds, every single frame, with no exceptions. C++ never does this: memory is freed exactly when a `delete` (or a smart pointer's destructor) runs, on a schedule *you* control, not one an automatic collector decides on its own.
- **Precise memory footprint.** Edge coprocessors typically have far less RAM than a laptop. Knowing exactly when memory is allocated and freed, instead of trusting a garbage collector to eventually notice something is unreachable and clean it up "at some point", is what makes it possible to reason about whether your inference pipeline will actually fit in the memory budget you have, with headroom to spare, instead of finding out the hard way at competition.

None of this makes C++ strictly "better" than Java or Python: it makes it the right tool for one specific job in this stack, at the cost of exactly the manual bookkeeping this topic just walked through.
