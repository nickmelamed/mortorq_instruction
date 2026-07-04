# 01 - Basics: Variables, Functions, Types, and Control Flow

Every programming language, no matter how different it looks on the page, is built out of the same small set of ideas. This topic covers those ideas in the abstract. The next three files (`java.ipynb`, `python.ipynb`, `cpp/basics.cpp`) show you the same ideas written for real in each language — this document is the "what and why," not the "how do I type it."

Two running examples carry the topic: a match-scoring calculator (add up points from goals scored and a climb) for variables, types, and functions, and a rangefinder reading on an arm (deciding whether it's close enough to a hard stop to halt) for control flow. Simple, but together they touch every idea below.

## Variables

A **variable** is a named slot that holds a value, so you can refer to that value later by name instead of retyping it. Every variable has a **type** — a category describing what kind of value it holds and what you're allowed to do with it (a whole number, a decimal number, true/false, a chunk of text, and so on).

Two languages can disagree on *when* they check that a variable's type is respected. As covered in `00_why_three_languages`, statically typed languages nail down each variable's type before the program ever runs; dynamically typed languages figure it out as the program executes. Either way, the concept of "a named, typed slot holding a value" is universal — only the enforcement differs.

## Functions

A **function** is a named, reusable block of instructions that can take inputs (**parameters**) and produce an output (a **return value**). Functions exist so you can write a piece of logic once and use it in many places, instead of copy-pasting the same code every time you need it.

For our example: instead of writing "if the sensor reads less than 6 inches, stop the arm" everywhere in your code that needs to make this check, you write one function — `shouldStopArm(distance)` — and call it wherever you need the answer. If the stopping distance ever changes, you fix it in exactly one place.

Functions typically have a **signature**: the types of the inputs they expect and the type of the output they produce. Some languages (Java, C++) require you to spell this signature out explicitly; others (Python) let you omit it and figure types out at call time.

## Types

Beyond just "what a variable holds," a language's **type system** is the whole set of rules about what values exist and how they can be combined. Every language you'll use here has, at minimum:
- **Integers** — whole numbers, for things like encoder tick counts or loop iteration counts.
- **Floating-point numbers** — decimal numbers, for things like sensor voltages, distances, or motor power (-1.0 to 1.0).
- **Booleans** — true/false, for things like "is the limit switch pressed?"
- **Text** (strings) — for things like log messages or a subsystem's name.
- **Collections** — a way to hold more than one value at once (covered in depth in `03_data_structures_algorithms`).

The important habit to build now: before you write a variable or a function, ask "what *kind* of value is this, really?" A distance is not the same kind of thing as a motor power, even though both might be represented as a decimal number — good code makes that distinction obvious through naming and, where the language supports it, through the type system itself.

## Control Flow

**Control flow** is how a program decides *what to execute next* — it's what turns a flat list of instructions into something that can react to conditions and repeat work. There are three patterns you'll use constantly:

- **Sequence** — instructions run one after another, top to bottom. The default.
- **Selection** (`if` / `else`) — the program picks between two or more paths based on a condition. "If the sensor reads less than 6 inches, stop the arm; otherwise, keep driving it toward the setpoint."
- **Iteration** (loops) — the program repeats a block of instructions, either a fixed number of times or until some condition becomes true. These are the two shapes you'll reach for constantly, and most languages give you a dedicated construct for each:
  - A **for loop** runs a known number of times, or once per item in a collection — reach for it when you know the loop's bound ahead of time, like "check every reading in this list."
  - A **while loop** keeps repeating as long as a condition stays true, with no built-in notion of "how many times" — reach for it when the stopping point depends on something that only becomes known while the loop is running, like "keep reading the sensor until it says stop."

  A robot's main control loop is really a while loop in spirit: "while the match is running, read sensors, decide what to do, send motor commands" — it doesn't run a fixed number of times, it runs until something external (the match clock, a disable signal) tells it to stop. This runs dozens of times per second for the entire match.

Every control flow structure you will ever use is some combination of these three patterns, layered on top of each other.

## Putting it together

The two examples from the top of this document use all four ideas together: the match-scoring calculator holds **variables** (goal counts, whether the robot climbed) with clear **types** (integers, a boolean) and a **function** that turns them into a score, while the rangefinder example adds **control flow** — an `if` inside a loop that runs continuously — to call a similar function every cycle and decide whether the reading means "stop."

Once you've read this, go work through `java.ipynb` and `python.ipynb`, and then `cpp/basics.cpp`, to see this exact example written for real in each language. Pay attention to what each language makes you spell out explicitly versus what it lets you skip — that gap is where a language's personality shows up.
