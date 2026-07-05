# 04b - Python Intricacies: Dynamic Typing, Duck Typing, and the ML Ecosystem

`00_why_three_languages` introduced dynamic typing at a high level: a Python variable's type is only checked while the program runs, not before. This topic goes one level deeper into what that buys you in practice, and why it's a big part of why nearly the entire machine learning world builds on Python.

## Duck typing

**Duck typing** is the practical consequence of dynamic typing, named after the idea "if it walks like a duck and quacks like a duck, it's a duck." In Python, when you call `some_object.some_method()`, Python doesn't check ahead of time whether `some_object`'s declared type promises to have `some_method` — there is no such promise to check, because Python variables don't have declared types at all. Python just tries to call `some_method` on whatever `some_object` actually is, right then, and it works as long as that particular object happens to have a method by that name that behaves sensibly. It doesn't matter what class the object is, or whether it inherits from anything in particular — only whether it has the right method, with the right behavior, at the moment you call it.

Contrast this with Java, where a function parameter's type is part of its declared signature, and the compiler checks every call site against it before the program can even build (see `02_oop_inheritance`'s comparison table for `interface`/`abstract class`, which is Java's formal way of promising "this method exists"). Python has no equivalent compile-time promise: the promise is implicit, and it's only checked the moment the method is actually called.

This isn't automatically better or worse than Java's approach. It's a different tradeoff. Duck typing makes it fast to write code that works with many different kinds of objects without formally declaring a shared interface for all of them up front, which is exactly the kind of flexibility you want while rapidly trying out an idea in a training notebook. It also means a typo in a method name, or handing a function an object that's missing a method it needed, isn't caught until that exact line of code actually runs, a class of mistake Java's compiler would catch before the program ever starts.

## Why Python dominates the ML ecosystem

This isn't really a language-design question. It's mostly historical and social, but it's worth understanding, since it's why you'll be doing all of your model training in Python regardless of which language you're most comfortable in.

- **The scientific Python ecosystem came first, and it compounds.** Libraries like `numpy` (fast numerical arrays) and `pandas` (tabular data) were built in Python and are decades old at this point. Nearly every major ML library since — `scikit-learn`, `PyTorch`, `TensorFlow` — was built to interoperate with that same numpy-based foundation rather than compete with it, because doing so meant instantly inheriting a huge, already-invested community. New tools keep choosing Python for the same reason, which keeps reinforcing the effect.
- **The heavy lifting isn't actually happening in Python.** The performance-critical inner loops of `numpy`, `PyTorch`, and friends are implemented in C, C++, or CUDA and merely *exposed* to Python. You get Python's fast, flexible, interactive iteration loop for the 95% of your work that's about experimenting with an idea, while the 5% that's actually number-crunching runs at compiled-language speed underneath. This is a major reason the "Python is slow" reputation doesn't actually block it from ML workloads: the slow part of Python is rarely the part doing the real work.
- **The interactive, notebook-driven workflow fits research.** Training a model is inherently iterative: try something, look at the data, adjust, retrain. Python's dynamic typing and lack of a separate compile step (see `00_why_three_languages`) make that loop fast to run, one cell at a time, in exactly the notebook format you're reading this in.

None of this means Python is "better" in some absolute sense. Plenty of production inference (see `05_capstone_pipeline`) deliberately moves *away* from Python once a model is trained, precisely because the properties that make Python great for prototyping (dynamic typing, an interpreter, less predictable performance) are liabilities once you need speed and predictability instead of iteration speed.

## Putting it together

`python.ipynb` walks through `numpy` and `pandas` basics, includes a small concrete duck typing demonstration, and ends with a minimal training loop using `scikit-learn` on a toy robotics dataset — the same kind of loop, just larger and on real data, that you'll build again in `05_capstone_pipeline`.
