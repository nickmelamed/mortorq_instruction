# 02 - Object-Oriented Programming: Classes, Inheritance, and Polymorphism

Your robot has multiple kinds of motor controllers wired up to it. We've used Talon, Kraken, and others (Spark, anyone?). All of them are "motors" in the sense that your code wants to do the same basic things to them: set a power, read a voltage, stop them. But each one talks a slightly different underlying protocol and has slightly different limits. Object-oriented programming (OOP) is the set of tools every language in this curriculum gives you to model these kinds of relationships. 

## Classes and objects

A **class** is a blueprint: it defines what data something has (its **fields**) and what it can do (its **methods**), without being any particular one of those things yet. An **object** is one concrete instance built from that blueprint, with its own actual field values.

`Motor` could be a class defining "every motor has a current power level, and can have its power set." A specific Talon wired to your intake mechanism is an *object*. An object is one instance of the `Motor` class (or, as we're about to see, one instance of some subclass of it), with its own current power value that's separate from every other motor's.

## Inheritance

**Inheritance** lets one class (a **subclass**) reuse and extend another class's (the **superclass**, or **base class**) fields and methods, instead of rewriting them from scratch. If `TalonMotor` and `SparkMotor` both inherit from `Motor`, they automatically get whatever `Motor` already defines, and each can add its own extra behavior or **override** (replace) a method with its own version.

Concretely: `Motor` might define a generic `setPower(power)` that just stores the value. `TalonMotor` overrides `setPower` to also clamp the value to the safe range Talons support; `SparkMotor` overrides it with a different clamp range, because Sparks have different limits. Both are still fundamentally `Motor`s — anything that's true for a `Motor` in general is true for both — but each handles its specific detail its own way.

This matters practically because it kills duplication. Without inheritance, you'd copy-paste the shared parts of `Motor` into every motor type and hope you keep them in sync by hand. With inheritance, the shared logic lives in exactly one place.

## Encapsulation and access modifiers

A class's fields and methods aren't automatically visible to every piece of code that touches an object of that type. Most languages let you control this with **access modifiers**:

- **public** — visible to any code that has an object of this type. This is what a method needs to be if other code is going to call it at all.
- **private** — visible only inside the class itself, not even from subclasses. Reach for this when a detail is purely internal and nothing else, including a subclass, should be able to touch it directly.
- **protected** — visible inside the class and any of its subclasses, but not from unrelated outside code. This is a middle ground that is crucial to inheritance. 

That middle ground is exactly why `Motor`'s fields (`name`, `currentPower`) are declared `protected` rather than `private` in Java and C++: `TalonMotor` and `SparkMotor` need direct access to `currentPower` to implement their own `setPower`, but code outside the `Motor` hierarchy has no business reaching in and changing it directly — it should go through methods like `setPower` and `describe` instead. Marking the fields `private` would lock subclasses out too, defeating the point; marking them `public` would let *any* code reach in and set `currentPower` directly, bypassing whatever clamping `setPower` is supposed to enforce.

Python doesn't enforce any of this. Every field is reachable from anywhere, and "privacy" is a naming convention only (a leading underscore, like `_current_power`, signals "treat this as internal" without anything actually stopping you) , which is part of why the Python example in this topic doesn't need `protected` to make sense, but the Java and C++ ones do.

## Polymorphism

**Polymorphism** ("many forms") is the payoff of inheritance: code that's written to work with the *base* class can work with *any* subclass, without knowing or caring which one it actually got.

Say you write a command that needs to run a motor at half power: `runAtHalfPower(Motor motor)`. Written against the base class `Motor`, this one function works correctly whether you hand it a `TalonMotor` or a `SparkMotor`. Each object still runs *its own* overridden `setPower`, even though the calling code only ever mentions `Motor`. This is what lets you write a `Subsystem` (an elevator, an intake, a drivetrain) once, in terms of "a motor," and swap the actual hardware underneath it later without rewriting the subsystem.

For this to work, a method call has to be resolved to the *actual* object's version at the moment the program runs, not to whatever the code merely *says* the type is when you're reading it. That distinction of deciding "which version of this method actually runs" at run time instead of compile time is called **dynamic dispatch**, and it's the mechanism underneath every polymorphism example above.

## Interfaces and abstract classes: contracts without implementation

Sometimes you want to guarantee "anything of this type has a `read()` method" without providing *any* default implementation at all you're defining a pure contract, not sharing code. That's an **interface** (Java has this as an explicit keyword; Python and C++ approximate it with a class that has no real implementation, sometimes called an *abstract base class*). A class that inherits from an interface must supply its own implementation for every method the interface declares, or it doesn't compile/count as fulfilling that contract.

`Motor` itself can be **abstract**: a base class that defines the *shape* every motor has (it has a `setPower` method, it has a `describe` method) without necessarily providing a real, sensible default for either, forcing every concrete subclass (`TalonMotor`, `SparkMotor`) to supply its own. This is useful specifically when there is no sensible generic default: what does "set power" even mean without knowing which hardware you're talking to?

## (Just enough) pointers and references for C++ polymorphism

Java and Python handle this next part invisibly: every object variable in those languages is already, under the hood, a reference to the actual object, so polymorphism just works the way you'd expect. C++ makes you handle this by hand, because in C++ a plain variable can hold an object's data *directly*, not just a reference to it. That difference is worth understanding before you open `cpp/Robot.h`.

**A pointer** is a variable that holds a memory address, which is the location of some other variable or object, rather than holding a value directly. **A reference** is an alias for an existing variable: another name for the same object, which (unlike a pointer) must be bound to something when it's created and can never be pointed somewhere else afterward. You access a member (a field or method) through a plain object with `.` (dot); you access a member through a pointer with `->` (arrow), which is shorthand for "follow the pointer to the object, then use dot." A reference uses `.` too, exactly like a plain object, and since a reference is just another name for the same object rather than a separate thing you have to follow, there's no separate arrow syntax for it.

Here's the part that actually matters for polymorphism: if you have a plain `Motor` variable (not a pointer, not a reference) and you assign a `TalonMotor` object into it, C++ only copies the `Motor` part of that object into the space it has, and the extra data and overridden behavior specific to `TalonMotor` gets cut off. This is called **object slicing**, and it silently defeats polymorphism: calling a method on that sliced variable runs `Motor`'s version, not `TalonMotor`'s, even though you started with a `TalonMotor`. A **pointer to `Motor`** or a **reference to `Motor`**, on the other hand, doesn't copy the object at all, it just refers to wherever the real, full `TalonMotor` object already lives, so the actual object's overridden methods are what run.

There's one more piece C++ requires that Java and Python don't: a base class method has to be explicitly marked `virtual` before overriding it in a subclass will actually take effect through a pointer or reference. Without `virtual`, C++ decides which version of a method to call based on the *declared* type of the pointer/reference (`Motor`) at compile time, ignoring the *actual* object's type (`TalonMotor`), which is the opposite of the dynamic dispatch behavior polymorphism depends on. With `virtual`, C++ instead looks up the actual object's type at run time, same as Java and Python do automatically. You'll see this play out directly in `cpp/Robot.h` and `cpp/main.cpp`.

(Note: this section is deliberately narrow. It does not cover heap allocation, `new`/`delete`, or memory ownership — that's `04a_cpp_intricacies`, once you've had more practice with the language. Every pointer and reference you'll see in this topic and in `03_data_structures_algorithms` refers to an object that already exists elsewhere — usually a local variable — not one you allocated yourself.)

## Putting it together

`java.ipynb` and `python.ipynb` build the same `Motor` / `TalonMotor` / `SparkMotor` hierarchy idiomatically in each language, then show a loop that treats a mix of motor objects uniformly through polymorphism. You'll notice neither one needs to think about pointers or references at all to make that work. `cpp/Robot.h`, `cpp/Robot.cpp`, and `cpp/main.cpp` build the identical hierarchy for real, and use pointers plus `virtual` methods to get the same uniform-loop behavior — you'll see exactly where C++ has to be explicit about something the other two languages hide from you.

## Resources

- **Java:**
  - [Oracle Java Tutorials: Interfaces and Inheritance](https://docs.oracle.com/javase/tutorial/java/IandI/index.html) - the official walkthrough of `extends`, `abstract`, and `interface`.
  - [WPILib `SubsystemBase`](https://docs.wpilib.org/en/stable/docs/software/commandbased/subsystems.html) - the real abstract base class every robot subsystem you write inherits from.
  - [WPILib `MotorController` interface](https://github.com/wpilibsuite/allwpilib/blob/main/wpilibj/src/main/java/org/wpilib/hardware/motor/MotorController.java) - the real interface unifying Talon, Spark, and Victor motor controllers in WPILib itself.
- **Python:**
  - [Python `abc` module docs](https://docs.python.org/3/library/abc.html) - abstract base classes in depth.
  - [Real Python: Inheritance and Composition](https://realpython.com/inheritance-composition-python/) - a deeper look at when to use inheritance vs. an alternative.
  - [WPILib `SubsystemBase`](https://docs.wpilib.org/en/stable/docs/software/commandbased/subsystems.html) - the real base class every robot subsystem you write inherits from.
- **C++:**
  - [cppreference: `virtual` function specifier](https://en.cppreference.com/w/cpp/language/virtual) - the official reference for the keyword this unit's "just enough pointers and references" section builds up to.
  - [cppreference: References](https://en.cppreference.com/w/cpp/language/reference) - the other half of "pointer or reference to `Motor`," covered precisely.
