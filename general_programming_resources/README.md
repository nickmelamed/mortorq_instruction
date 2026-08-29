# General Programming Resources

This curriculum is a sibling to `back_end_resources`, `front_end_resources`, and `git_resources`, not a continuation of any of them. Where those teach you to build in a specific language or domain, this one teaches the habits that make you a better programmer *regardless* of what you're building: organizing code, documenting it, managing dependencies, debugging methodically, testing well, keeping work reproducible, reading code you didn't write, and more. Start with `00_intro/concept.md`.

## Folder Organization

Each numbered topic has:

- **`concept.md`** — the idea itself, explained through examples spanning multiple languages, plus explicit pointers to wherever else in the curriculum this idea shows up. Read this first.
- **`examples/`** — a short, concrete, usually broken-or-messy artifact to diagnose or fix: a badly named function, a tangled file layout, a flaky test, an undocumented file. This folder leans harder on "fix it" than "build it," since the goal is diagnostic instinct, not new syntax.
- **`exercises/`** — one or more numbered exercise files with a clear done condition, sized for a class period.

## Directory Structure

```text
general_programming_resources/
├── 00_intro/                                Why this folder exists, and how it differs from the rest of the curriculum
├── 01_shell_cli_literacy/                   Navigation, file ops, streams/exit codes, chaining, process control, permissions, grep/find, basic scripting
├── 02_code_organization_modularization/     Single responsibility, coupling vs. cohesion, naming as documentation
├── 03_file_project_structure/               Reading a project's layout as a map of its intent
├── 04_documentation/                        Reading and writing docs; README structure, docstrings, when not to comment
├── 05_dependency_management/                Semver, lockfiles, transitive risk, and whether to add a dependency at all
├── 06_debugging_methodology/                Reproduce -> isolate -> hypothesize -> test -> fix; reading stack traces
├── 07_testing_philosophy/                   Test pyramid, brittle vs. good tests, TDD as a tool, when not to test
├── 08_reproducibility/                      "Works on my machine," environment pinning, seeding randomness, why containers exist
├── 09_refactoring_technical_debt/           Code smells, refactoring incrementally, debt as a sometimes-acceptable tradeoff
├── 10_reading_unfamiliar_code/              Flagship topic: orienting in a codebase you didn't write
├── 11_style_linting/                        Why automated formatting exists, and what it buys a team
├── 12_complexity_performance_intuition/     Recognizing an obvious performance footgun, without deriving Big-O
├── 13_designing_under_constraints/          Defining tolerance, timeout, and fallback before you write the loop
├── 14_building_with_intent/                 YAGNI, goal metrics, designing for real end users, and matching the quality bar to where code lives
├── 15_technical_communication/              Writing and explaining technical work for a reader who won't open the code
├── 16_code_review/                          Reviewing someone else's change well, and receiving review without taking it personally
├── 17_pair_programming_and_workflow/        Driver/navigator pairing, Kanban vs. sprints, and what "done" actually means
├── 18_onboarding_and_mentorship/            The veteran's-side companion to 10: leaving a map, instead of making newcomers rediscover one
├── 19_postmortems_and_incident_review/      Blameless postmortems: writing down what broke and why, so it doesn't recur
└── README.md                                This file
```

## How to Use This Folder

This folder is a shelf, not a staircase. Every module stands on its own and can be assigned in any order, as early as a student can write a single function, and revisited all season. The one soft exception is `01_shell_cli_literacy`: several other modules (`03`, `06`, `08`, `10`) assume basic comfort in a terminal, so it's worth covering early even though nothing enforces that order. See `00_intro/concept.md` for the full reasoning, including the throughline connecting `01`, `03`, `09`, and `10` around one goal,

## What's Not Included

- **Git and version control** has its own dedicated curriculum in `git_resources`. This folder assumes it as a prerequisite and references it where relevant, but doesn't re-teach it.
- **Logging and observability**, as an applied skill, lives in `back_end_resources/systems_primer/07_logging_observability`.
- **Testing frameworks** (JUnit, WPILib simulation, and the frontend equivalent) live in `back_end_resources/systems_primer/06_testing_debugging` and `front_end_resources/frontend_systems_primer/07_testing`. This folder's `07_testing_philosophy` owns the underlying idea of what makes a test worth having, not the mechanics of any one framework.
- **Deep algorithmic complexity** (real Big-O analysis, choosing between data structures) has its own dedicated unit later in the curriculum. `12_complexity_performance_intuition` is a light teaser, not a substitute for it.
- **Configuration and constants management**, as an applied skill (pulling magic numbers into a named, centralized `Constants` file; practice-bot vs. comp-bot profiles), lives in `back_end_resources/systems_primer/09_configuration_constants_management`. `14_building_with_intent`'s production-vs-local section points to it rather than re-teaching it.
- **Robot-deployment CLI usage** (WPILib/Gradle deploy commands, the actual project scaffold, vendor libraries) is covered in `frc_resources/07_project_scaffold_and_deploy`, not here. `01_shell_cli_literacy` teaches transferable shell skills only and does not cover robot-deploy specifics.
- **Career and interview preparation** (resumes, technical interviews) is deliberately out of scope. This folder builds the underlying engineering skill; it doesn't teach job-search mechanics on top of it.
