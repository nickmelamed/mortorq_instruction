# 03 - File & Project Structure

## A layout is a map, not decoration

Before you read a single line of logic in a project, its file structure has already told you something: where the entry point is, where the real logic lives, where tests live, where configuration lives, what's actually part of the project versus what's leftover cruft nobody cleaned up. A well-organized project lets you answer "where would X live?" *before* you've read any code, just by knowing the convention. A poorly organized one — everything dumped in one flat folder, stale files sitting next to current ones, no separation between source and tests — forces you to read everything just to find anything. This module is `02_code_organization_modularization`'s idea (single responsibility, low coupling, high cohesion) applied one level up: instead of organizing what's *inside* a function or class, you're organizing what's inside a project.

## Conventions you'll recognize, in every stack you touch

Different ecosystems use different names, but the same handful of ideas repeat everywhere:

| What it is | Java/WPILib | Python | JS/TS (npm) | C++ |
|---|---|---|---|---|
| Where source code lives | `src/main/java/...` | a package folder, or `src/` | `src/` | `src/` |
| Where tests live | a parallel `src/test/java/...` tree | `tests/`, or `test_*.py` files | `tests/`, or `*.test.ts` files | `test/` |
| The entry point | a `Main`/`Robot` class | `main.py`, or `if __name__ == "__main__":` | `index.ts`/`main.tsx` | `main.cpp` |
| Project-level config | `build.gradle` | `requirements.txt`/`pyproject.toml` | `package.json` | `Makefile`/`CMakeLists.txt` |
| Human-facing docs | `README.md` | `README.md` | `README.md` | `README.md` |

Once you recognize this pattern, dropping into a project in a language you've never used still gets you most of the way to "where do I start reading" — you already know to look for the entry point and the README first, no matter what the surrounding syntax looks like. This is exactly why every primer in this curriculum keeps the same handful of file names and roles (`concept.md`, `exercises/`, `README.md`) — once you know the pattern here, you know it everywhere in this repo, too.

## Reading a layout before reading any logic

When you land in an unfamiliar project, resist opening a random file first. Instead:

1. **Read the README, if one exists.** It's usually the fastest way to learn what the project does and how it's meant to be run, straight from whoever wrote it.
2. **List the top level** (`ls`, or `find . -maxdepth 2`, from `01_shell_cli_literacy`) before going any deeper. The top-level folder names alone usually tell you the project's shape: is this one script, or does it separate source from tests from config?
3. **Find the entry point.** Every runnable project has to start somewhere — a `main`, a `Main` class, an `index`. Once you know where execution *begins*, you have a thread to follow into everything else.
4. **Treat file/folder names as claims**, and be a little suspicious of the ones that don't hold up: a file called `old_main_v2.py` sitting next to `main.py` is telling you, honestly, that it's stale — the question is just whether anyone's confirmed it's safe to delete.

This is the same `find`/`grep`-driven orientation process `01_shell_cli_literacy` taught, aimed one level up: instead of searching *inside* files for a specific string, you're reading the *shape* of the project itself before you ever open one.

## Grouping files: by type, or by feature

Once a project outgrows one flat folder, there are two common ways to split it up, and it's worth recognizing both when you see them: **by layer/type** (all your models together, all your commands together, all your utility functions together — this is what WPILib's `subsystems/`, `commands/` split does) versus **by feature** (everything related to one feature — its logic, its tests, its config — grouped in one folder together, regardless of type). Neither is universally "correct" — small and medium projects (including everything in this curriculum) tend to organize by layer/type because it's simpler to navigate with only a handful of features; large real-world codebases often shift toward by-feature as the number of features grows large enough that "all the models" stops being a useful grouping. Recognizing which style a project uses is part of reading its layout as a map.

## Putting it together

Open `examples/tangled_project/` — a small, real, working Python tool (it computes an average match cycle time from a CSV) with every file dumped flat into one folder: source, a test, actual setup instructions mislabeled as `notes.txt`, a stale duplicate (`old_main_v2.py`), and a leftover artifact from a previous run (`test_output.txt`). Run it first (`python main.py`) to see that it works exactly as-is, then move to `exercises/` to reorganize it into a structure a new reader could actually make sense of at a glance.

## See also

- **`02_code_organization_modularization`** — the same organizing instinct, applied inside a function or class instead of across a project's files.
- **`10_reading_unfamiliar_code`** — this module's orientation steps (README first, entry point, top-level listing) are exactly how you'll start orienting in a much larger, real inherited codebase.
- **`01_shell_cli_literacy`** — the `ls`/`find` skills this module leans on directly.

## Resources

- [pyOpenSci Python Package Guide](https://www.pyopensci.org/python-package-guide/) - a real, current guide to conventional Python project layout, if you want to go past this module's summary.
- [WPILib: Command-Based Programming](https://docs.wpilib.org/en/stable/docs/software/commandbased/index.html) - the official docs for the `subsystems/`/`commands/` split referenced in the table above.
