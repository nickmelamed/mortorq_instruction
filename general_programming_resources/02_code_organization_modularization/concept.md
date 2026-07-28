# 02 - Code Organization & Modularization

## Why structure is a habit, not a chore

Two codebases can do the exact same thing and take wildly different amounts of time to change. The difference is almost never the language — it's whether the code is organized so that a single change touches one clearly-named place, or scattered so that the same change means hunting through a function that does six unrelated things at once. This module is about three ideas that make that difference: **single responsibility**, **coupling and cohesion**, and **naming**. All three apply identically whether you're writing Java, Python, C++, or TypeScript — none of what follows is language-specific, on purpose.

## Single responsibility

A function or class should have **one reason to change**. Not one line of code, not one instruction — one *reason*. A function that reads a sensor, decides what to do with the reading, drives a motor, and logs all of it has at least four reasons to change: the sensor's units, the decision logic, the motor interface, and the log format could each change independently, and every one of those changes means editing the same block of code.

```java
// One function, four responsibilities, one reason each to break the others
void doStuff() {
    double x = sensor.read();
    double y = x > 10 ? x * 0.5 : x * 2;
    System.out.println("output=" + y);
    motor.set(y);
}
```

```python
# Same problem, same shape, different language
def do_stuff():
    x = sensor.read()
    y = x * 0.5 if x > 10 else x * 2
    print(f"output={y}")
    motor.set(y)
```

The fix isn't to write less code — it's to split this into named pieces, each with one job: something that reads the sensor, something that decides the output value, something that drives the motor, something that logs. Each piece becomes easy to test, reuse, and change without touching the others.

## Coupling vs. cohesion

These two ideas are opposite ends of the same measurement:

- **Cohesion** is how related the things *inside* one function, class, or module are. High cohesion means everything in there is working toward one clear job. A class called `MatchUtils` with an unrelated grab-bag of static helpers (`convertUnits`, `parseConfig`, `sendNotification`) has low cohesion — nothing in it belongs together, it's just where things got dumped.
- **Coupling** is how entangled *separate* pieces are with each other. Low coupling means you can change one piece's internals without breaking another. High (or "tight") coupling means one class reaching directly into another's internal fields, or one module depending on exactly how another one is implemented instead of just what it promises to do.

```cpp
// Tight coupling: this function depends on Drivetrain's internal fields directly
void adjustHeading(Drivetrain& dt) {
    dt.leftMotorPower = dt.leftMotorPower * 0.9;  // reaching into internals
}
```

```cpp
// Loose coupling: this function only depends on a public interface Drivetrain promises to keep
void adjustHeading(Drivetrain& dt) {
    dt.setLeftPower(dt.getLeftPower() * 0.9);
}
```

The goal is **high cohesion, low coupling**: each piece does one clear job internally, and pieces talk to each other only through a clean, stable interface — not by reaching into each other's guts. A `useState` hook and the component holding it are meant to be tightly cohesive; that same component reaching into a *sibling* component's internal state directly (instead of through props or a shared parent) is exactly the kind of coupling this idea warns against, and it's the reason React's one-way data flow exists in the first place.

## Naming as a form of documentation

A name is the cheapest, most-read piece of documentation you will ever write, because every single person who touches your code reads the names before they read anything else. `doStuff()`, `x`, `y`, `flag2`, `tmp` all describe *nothing* — they force the next reader (often you, in three weeks) to read the entire function body just to find out what a variable holds or what a function does. Compare:

| Bad | Good | Why |
|---|---|---|
| `x`, `y` | `sensorAngleDegrees`, `motorPowerOutput` | says what the value *is*, not just that it exists |
| `doStuff()` | `computeMotorPowerFromAngle()` | says exactly what happens, not that "something" does |
| `flag2` | `isHoldModeActive` | says what the boolean *means*, not that it's the second one you needed |
| `tmp` | `previousHeading` | says what the value is *for* |

A well-named function often needs zero comments to explain *what* it does — the name already says it. This is the same principle `04_documentation` picks up from the other side: a comment that only restates what the code does is a sign the code should have been named better instead, not a sign you need more comments.

## Putting it together

Open `examples/messy_autonomous/` — the same badly-organized routine in Java and Python, seeded so its output is reproducible. Run whichever version(s) you're comfortable in and record the output, then refactor it: split it into single-responsibility, well-named pieces (a sensor-reading function, a decision function, a motor-driving function, a logging step) without changing what it actually does. Re-run it afterward — the output should be identical, just produced by code that's obviously organized instead of accidentally organized.

## See also

- **`03_file_project_structure`** — this module is about organization *inside* a function or class; `03` is the same idea one level up, at the file and folder level.
- **`09_refactoring_technical_debt`** — the process of improving structure incrementally in code that already works, without breaking it, once you've spotted a problem like the one in this module's example.
- **`04_documentation`** — where the "naming vs. commenting" boundary gets picked back up in full.

## Resources

- [Wikipedia: Single-responsibility principle](https://en.wikipedia.org/wiki/Single-responsibility_principle) - the formal statement of the idea this module opens with.
- [Wikipedia: Coupling (computer programming)](https://en.wikipedia.org/wiki/Coupling_(computer_programming)) - a deeper look at degrees of coupling, from loose to tight.
- [Wikipedia: Cohesion (computer science)](https://en.wikipedia.org/wiki/Cohesion_(computer_science)) - the same treatment for cohesion, cohesion's counterpart.
