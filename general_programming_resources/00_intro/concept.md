# 00 - Habits That Transfer

Every other folder in this curriculum teaches you to build something specific: `back_end_resources/language_primer` teaches Java/Python/C++, `front_end_resources/web_fundamentals_primer` and `front_end_resources/frontend_systems_primer` teach a how to build our team website, `git_resources` teaches version control, and so on and so forth. This folder is different because it is language and framework agnostic; these principles apply generally across programming tasks. It's the set of habits that make you a better programmer *no matter what you're writing*.

You've probably already felt the gap these habits fill. This year's team inherits a full codebase every fall from last year's team, and someone has to open it cold and figure out what's going on before touching anything. A "quick fix" turns into an hour because nobody can tell which file actually controls the behavior that's wrong. A script works on one laptop and throws an error on another, for reasons nobody can explain. None of that is a Java problem or a Python problem! It's a *programming* problem, and it shows up regardless of which language you're looking at.

## What's in This Folder

1. **Shell & CLI literacy** — navigating, searching, and scripting from a terminal. The substrate everything else here sits on.
2. **Code organization & modularization** — single responsibility, coupling vs. cohesion, naming as documentation.
3. **File & project structure** — reading a project's layout as a map of its intent, before you read a single line of logic.
4. **Documentation** — reading and writing as distinct skills; what to write down, what to leave to the code itself.
5. **Dependency management** — semver, lockfiles, transitive risk, and whether to add the dependency at all.
6. **Debugging methodology** — a repeatable process for finding a bug, instead of guessing and poking.
7. **Testing philosophy** — what makes a test worth having, independent of any specific testing framework.
8. **Reproducibility** — why "works on my machine, not another one" happens, and what actually prevents it.
9. **Refactoring & technical debt** — recognizing inefficient code (and how it will cost you later), and improving code without breaking it.
10. **Reading unfamiliar code** — the flagship topic: how to orient yourself in a codebase you didn't write.
11. **Style & linting as a collaboration tool** — why automated formatting exists, and what it buys a team.
12. **Complexity & performance intuition** — noticing an obvious performance footgun, long before you need real Big-O.
13. **Designing under constraints** — deciding what "close enough" means, assuming anything you didn't compute yourself can fail, and knowing your time/resource budget before you're over it.
14. **Building with intent** — knowing what you're building, for whom, and to what bar, before you build it.
15. **Technical communication** — explaining technical work and tradeoffs to a reader who's never going to open your code: an interviewer, a judge, a PR reviewer without your context.
16. **Code review** — reviewing someone else's changes, and receiving a review of your own.
17. **Pair programming & lightweight team workflow** — driver/navigator pairing, Kanban vs. sprints, and what "done" actually means.
18. **Onboarding & mentorship** — the veteran's-side companion to `10`: leaving a map behind, instead of making every future newcomer rediscover one alone.
19. **Postmortems & incident review** — writing down what broke and why, after the fact, so the same failure doesn't recur.

## Why This Folder is Different

Every other primer in this curriculum has a suggested order, because later topics build on earlier ones; `back_end_resources/language_primer`'s `03_data_structures_algorithms` needs the pointer knowledge `02_oop_inheritance` just taught you, for instance.

 Every module here is written to stand on its own, so a mentor can assign any one of them the moment it's actually useful: `10_reading_unfamiliar_code` is helpful early on when we look at older codebases. `06_debugging_methodology` is great once we turn up difficult problems nobody can fix. You don't need to have finished `back_end_resources/language_primer`, or even much of it, to start here, because every module is illustrated with short examples in whatever language you already know a little of, not gated behind a specific one. The one (soft) exception is `01_shell_cli_literacy`, since enough of the other modules assume you can already navigate a terminal (`03`, `06`, `08`, `10` all lean on it directly) that it's worth doing early.

## The Big Picture: Codebase Fluency 

Four of these modules — `01` (shell/CLI), `03` (file/project structure), `09` (refactoring), and `10` (reading unfamiliar code) — are really one skill wearing four different hats: **finding your way around a codebase**. A terminal and `grep`/`find` are how you search a codebase you can't read start to finish. A project's file structure is a map of its intent, if you know how to read it. Refactoring is what you do once you understand code well enough to improve it without breaking it. And reading unfamiliar code is the moment all three of those get used together at once, which is exactly what happens every fall when the team inherits a codebase from students who already graduated. Keep that connection in mind as you go through this folder.

## Where These Habits Show Up

This folder teaches each idea well enough to stand on its own, but several of them have a deeper, applied home elsewhere in the curriculum, and it's worth knowing where to look next:

- **Git and version control** is its own full curriculum in `git_resources` — this folder assumes you'll use it, but doesn't re-teach it.
- **Logging and observability**, as an applied skill, lives in `back_end_resources/systems_primer/07_logging_observability`. `14_building_with_intent`'s production-vs-local section points to it rather than re-teaching it.
- **Testing frameworks** — JUnit and WPILib simulation testing live in `back_end_resources/systems_primer/06_testing_debugging`; the frontend equivalent is reserved for `front_end_resources/frontend_systems_primer/07_testing`. This folder's `07_testing_philosophy` teaches what makes a test good in the first place, not how to write one in a specific framework.
- **Debugger tooling** (`pdb`, browser DevTools) doesn't currently have a dedicated home anywhere else in this curriculum, so `06_debugging_methodology` includes a short, practical pass on the real tools alongside the underlying idea. **Dependency-management tooling** (`pip`/`venv`, `npm`, Maven/Gradle) gets the same practical pass in `05_dependency_management`; the FRC-specific, real-stakes version of it — vendor libraries and GradleRIO — has its own applied home in `frc_resources/08_project_scaffold_and_deploy`.
- **Deep algorithmic complexity** (real Big-O analysis, choosing between data structures) has its own dedicated unit coming later. `12_complexity_performance_intuition` is deliberately a teaser: just enough to notice a footgun, not a substitute for that unit.
- **Configuration and constants management** (pulling magic numbers into a named, centralized `Constants` file; practice-bot vs. comp-bot profiles) lives in `back_end_resources/systems_primer/09_configuration_constants_management`. `14_building_with_intent`'s production-vs-local section points to it rather than re-teaching it.
- **The full, hardware-applied version of `13_designing_under_constraints`** lives in `back_end_resources/systems_primer` (`01`, `04`, `04b`, `08`). This folder teaches the mindset in the abstract, with one hardware and one non-hardware worked example; `systems_primer` is where it gets applied in real depth to an actual robot.
- **The PR format `15_technical_communication` builds on** is `git_resources/CONTRIBUTING.md`'s branch, commit, and PR conventions. That document owns the mechanics (naming, checklist, format); `15` owns the thinking behind writing a good one.
- **The deep, screen-and-form version of `14_building_with_intent`'s end-user section** lives in `front_end_resources/product_design_primer`; that primer covers user-needs statements, prototyping fidelity, and usability testing for actual UI. `14` only generalizes the underlying mindset to non-visual and backend code, including your teammates and future-you as readers of the code itself.
- **Robot-deployment CLI usage** — the WPILib/Gradle commands that actually push code to a robot, the real project scaffold, and vendor libraries is covered in `frc_resources/08_project_scaffold_and_deploy`, not here. `01_shell_cli_literacy` teaches transferable shell skills only and does not cover robot-deploy specifics.
- **Career and interview preparation** (resumes, technical interviews) is deliberately out of scope for this curriculum. This folder builds the underlying skill (`10`, and now `14`-`19` all transfer directly to a professional engineering job), but doesn't teach the job-search mechanics on top of it.

## Resources

- [Peter Norvig: Teach Yourself Programming in Ten Years](https://norvig.com/21-days.html) - a well-known essay on why durable habits, not quick tricks, are what actually make someone a better programmer over time. The philosophy underneath this entire folder.
- [The Twelve-Factor App](https://12factor.net/) - a widely-cited set of practices for reliable, reproducible software. You won't need all of it, but its sections on dependencies, config, and disposability are the same ideas `05`, `08`, and `09` cover here, from the professional-software-engineering side.
