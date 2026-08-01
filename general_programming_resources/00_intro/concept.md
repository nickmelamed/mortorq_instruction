# 00 - Habits That Transfer, Not Languages That Change

Every other folder in this curriculum teaches you to build something specific: `language_primer` teaches Java/Python/C++, `systems_primer` teaches backend patterns for a robot that has to survive a live match, `web_fundamentals_primer` and `frontend_systems_primer` teach a browser-based scouting app, `git_resources` teaches version control. This folder is different on purpose: nothing here is tied to a language, a framework, or a project. It's the set of habits that make you a better programmer *no matter what you're writing* — how you organize a file, how you debug a crash, how you decide whether a dependency is worth adding, how you walk into code you didn't write and find your footing.

You've probably already felt the gap these habits fill, even if you didn't have a name for it. The team inherits a full codebase every fall from last year's graduated seniors, and someone has to open it cold and figure out what's going on before touching anything. A "quick fix" turns into an hour because nobody can tell which file actually controls the behavior that's wrong. A script works on one laptop and throws an error on another, for reasons nobody can explain. None of that is a Java problem or a Python problem — it's a *programming* problem, and it shows up identically regardless of which language you're looking at.

## What's in this folder

1. **Shell & CLI literacy** — navigating, searching, and scripting from a terminal. The substrate everything else here sits on.
2. **Code organization & modularization** — single responsibility, coupling vs. cohesion, naming as documentation.
3. **File & project structure** — reading a project's layout as a map of its intent, before you read a single line of logic.
4. **Documentation** — reading and writing as distinct skills; what to write down, what to leave to the code itself.
5. **Dependency management** — semver, lockfiles, transitive risk, and whether to add the dependency at all.
6. **Debugging methodology** — a repeatable process for finding a bug, instead of guessing and poking.
7. **Testing philosophy** — what makes a test worth having, independent of any specific testing framework.
8. **Reproducibility** — why "works on my machine" happens, and what actually prevents it.
9. **Refactoring & technical debt** — recognizing code smells, and improving code without breaking it.
10. **Reading unfamiliar code** — the flagship topic: how to orient yourself in a codebase you didn't write.
11. **Style & linting as a collaboration tool** — why automated formatting exists, and what it buys a team.
12. **Complexity & performance intuition** — noticing an obvious performance footgun, long before you need real Big-O.
13. **Designing under constraints** — deciding what "close enough" means, assuming anything you didn't compute yourself can fail, and knowing your time/resource budget before you're over it.

## How this folder is different from everything else here

Every other primer in this curriculum has a suggested order, because later topics build on earlier ones — `language_primer`'s `03_data_structures_algorithms` needs the pointer knowledge `02_oop_inheritance` just taught you, for instance. **This folder doesn't work that way.** Every module here is written to stand on its own, so a mentor can assign any one of them the moment it's actually useful: `10_reading_unfamiliar_code` in September when the team inherits last year's codebase, `06_debugging_methodology` the first time a bug takes someone two hours to find, `09_refactoring_technical_debt` the first time someone says "we'll clean it up later." You don't need to have finished `language_primer`, or even much of it, to start here — every module is illustrated with short examples in whatever language you already know a little of, not gated behind a specific one. The one soft exception is `01_shell_cli_literacy`: enough of the other modules assume you can already navigate a terminal (`03`, `06`, `08`, `10` all lean on it directly) that it's worth doing early, even though nothing enforces that order.

## The throughline: codebase fluency

Four of these modules — `01` (shell/CLI), `03` (file/project structure), `09` (refactoring), and `10` (reading unfamiliar code) — are really one skill wearing four different hats: **the ability to drop into any codebase, yours or someone else's, and confidently find your way around it.** A terminal and `grep`/`find` are how you search a codebase you can't read start to finish. A project's file structure is a map of its intent, if you know how to read it. Refactoring is what you do once you understand code well enough to improve it without breaking it. And reading unfamiliar code is the moment all three of those get used together at once, which is exactly what happens every fall when the team inherits a codebase from students who already graduated. Keep that connection in mind as you go through this folder — it's not four unrelated topics that happen to share a directory, it's one goal approached from four directions.

## Where these habits show up for real

This folder teaches each idea well enough to stand on its own, but several of them have a deeper, applied home elsewhere in the curriculum, and it's worth knowing where to look next:

- **Git and version control** is its own full curriculum in `git_resources` — this folder assumes you'll use it, but doesn't re-teach it.
- **Logging and observability**, as an applied skill, lives in `systems_primer/07_logging_observability`.
- **Testing frameworks** — JUnit and WPILib simulation testing — live in `systems_primer/06_testing_debugging`; the frontend equivalent is reserved for `frontend_systems_primer/07_testing`. This folder's `07_testing_philosophy` teaches what makes a test good in the first place, not how to write one in a specific framework.
- **Dependency-management and debugger tooling** (`pip`/`venv`, `npm`, Maven/Gradle, `pdb`, browser DevTools) don't currently have a dedicated home anywhere else in this curriculum, so `05_dependency_management` and `06_debugging_methodology` each include a short, practical pass on the real tools alongside the underlying idea — enough to actually use them, not a full reference.
- **Deep algorithmic complexity** (real Big-O analysis, choosing between data structures) has its own dedicated unit coming later. `12_complexity_performance_intuition` is deliberately a teaser: just enough to notice a footgun, not a substitute for that unit.
- **The full, hardware-applied version of `13_designing_under_constraints`** lives in `back_end_resources/systems_primer` (`01`, `04`, `04b`, `08`). This folder teaches the mindset in the abstract, with one hardware and one non-hardware worked example; `systems_primer` is where it gets applied in real depth to an actual robot.
- **Robot-deployment CLI usage** — the WPILib/Gradle commands that actually push code to a robot — is a known gap in `back_end_resources` right now. `01_shell_cli_literacy` teaches transferable shell skills only; the robot-specific deploy tooling is a separate unit students should expect later.

## How to work through this

Read this page once, then treat the rest of this folder as a shelf, not a staircase — pull a module down when it's the thing you actually need, whether that's week one of the season or partway through build season when a problem this folder has a name for shows up in the wild. If you're brand new and not sure where to start, start with `01_shell_cli_literacy`, then jump to whichever other module matches whatever you're stuck on.

## Resources

- [Peter Norvig: Teach Yourself Programming in Ten Years](https://norvig.com/21-days.html) - a well-known essay on why durable habits, not quick tricks, are what actually make someone a better programmer over time. The philosophy underneath this entire folder.
- [The Twelve-Factor App](https://12factor.net/) - a widely-cited set of practices for reliable, reproducible software. You won't need all of it, but its sections on dependencies, config, and disposability are the same ideas `05`, `08`, and `09` cover here, from the professional-software-engineering side.
