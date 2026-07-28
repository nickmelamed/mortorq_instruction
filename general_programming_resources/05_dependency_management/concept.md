# 05 - Dependency Management

## Every dependency is code you didn't write, running in your project anyway

The moment you `pip install` or `npm install` something, you've taken on two things at once: the functionality you wanted, and every bug, security issue, and future breaking change that library's author ever introduces. That's not a reason to avoid dependencies — reimplementing `numpy` or `react` yourself would be absurd — but it is why "just add the package" is a real engineering decision, not a free action. This module covers the three things that decision actually depends on: how versions communicate risk, how lockfiles pin down what "install this project" even means, and when the right call is to *not* add a dependency at all.

## Semantic versioning (semver)

Most published packages follow **`MAJOR.MINOR.PATCH`** (e.g. `2.4.1`), and each number is a promise about what changed:

- **PATCH** (`2.4.1` -> `2.4.2`) — bug fixes only. Should be safe to take automatically.
- **MINOR** (`2.4.1` -> `2.5.0`) — new functionality was added, but nothing that already worked should break.
- **MAJOR** (`2.4.1` -> `3.0.0`) — something that used to work might not anymore. Read the changelog before upgrading.

Package managers let you express how much of that you're willing to accept automatically. In `npm`'s `package.json`, `^2.4.1` means "any version that doesn't bump MAJOR" (safe minor/patch updates allowed), `~2.4.1` means "any version that doesn't bump MINOR either" (patches only), and a bare `2.4.1` means exactly that version, nothing else. Python's `pip` uses a similar idea with different symbols: `pandas>=2.0,<3.0` allows any 2.x release, `pandas==2.1.4` pins exactly one. Whichever ecosystem you're in, the tradeoff is the same one: a wider range gets you fixes automatically but risks an unexpected breaking change; a narrower pin is predictable but goes stale, silently missing fixes, unless someone deliberately revisits it.

## Lockfiles: what "install this project" actually means

A manifest (`package.json`, `requirements.txt`, a Gradle `build.gradle`) says what you *want* — "give me some 2.x version of pandas." It does **not** say which exact version, and it says nothing at all about **transitive dependencies** — the dependencies of your dependencies, which you never typed in yourself but are running in your project regardless. A **lockfile** (`package-lock.json`, `poetry.lock`, a resolved Gradle dependency lock) records the *exact*, fully-resolved version of every single package — direct and transitive — that was actually installed the last time someone ran the installer successfully. That's the entire reason lockfiles exist: without one, "it works on my machine" can be true purely because your machine happened to resolve a different transitive version than someone else's did, on the exact same manifest. This is `08_reproducibility`'s subject from the dependency side specifically — a lockfile is one of the most common concrete answers to "why doesn't this reproduce."

## Transitive risk, and the left-pad story

In 2016, an npm package called `left-pad` — eleven lines of code that padded a string with leading characters — was unpublished by its author over an unrelated dispute. Thousands of projects, including some at major companies, broke immediately, because `left-pad` was a *transitive* dependency buried several layers deep in packages they depended on directly, and none of them had ever consciously decided to depend on it at all. Nobody who broke that day chose to trust `left-pad`'s author — they chose to trust some other package, which chose to trust another, which happened to trust `left-pad`. Every dependency you add is also every dependency *it* depends on, recursively, whether you ever look at that list or not.

## The judgment call: should this be a dependency at all

Before adding a package, it's worth actually asking:

- **How much code would this replace?** A well-tested library saving you from a genuinely hard, easy-to-get-wrong problem (cryptography, date/timezone handling, a parser for a real file format) is usually worth it. A package that exists to wrap a single, obvious one-liner (padding a number with zeros, checking if a string is empty) usually isn't — you're accepting a whole dependency's worth of risk for something `str(n).zfill(3)` already does.
- **How maintained is it?** A package with recent commits, responsive maintainers, and wide adoption is a safer bet than one last updated years ago with a handful of downloads.
- **What does it pull in transitively?** A "small" package that drags in forty other packages behind it isn't small — check before you install, not after something breaks.

None of these have a formula — they're judgment calls, made deliberately, not skipped by reaching for the first package that shows up in a search.

## The mechanics: pip/venv, npm, and Maven/Gradle

Nothing else in this curriculum currently walks through *how* these tools actually work, so here's enough to use them, even though the ideas above are the real point of this module:

**Python — `pip` and virtual environments.** A **virtual environment** is an isolated folder holding one project's own installed packages, separate from your system's Python and every other project's environment — without one, installing one project's dependencies can silently break another's. `python -m venv .venv` creates one; `source .venv/bin/activate` (Mac/Linux) or `.venv\Scripts\Activate.ps1` (Windows) switches your shell into it; `pip install <package>` installs into whichever environment is currently active; `pip freeze > requirements.txt` writes down the exact versions currently installed, which is `pip`'s closest equivalent to a lockfile.

**JavaScript/TypeScript — `npm`.** `package.json` is the manifest — your direct dependencies and their version ranges, split into `dependencies` (needed to run the project) and `devDependencies` (needed only to build/test it, like a linter or test runner). `npm install` reads it and produces (or updates) `package-lock.json`, the real lockfile, then installs everything into `node_modules/` — a folder you never edit by hand and never need to fully understand the contents of.

**Java — Maven/Gradle.** Java's build tools (Maven's `pom.xml`, Gradle's `build.gradle`, the one WPILib projects actually use) work the same way conceptually: a declarative block listing dependencies and version ranges, resolved against a central repository (Maven Central), with the build tool handling the transitive resolution for you. The syntax differs from `pip`/`npm`, but you're reading and reasoning about the exact same three things: a manifest, a version range, and a resolved dependency tree.

## Putting it together

Open `examples/scouting_tool/` — a small project's `requirements.txt` and the one script that uses it. Some lines are pinned in ways that will cause real problems; one dependency exists to replace a single line of code you could write yourself in under a minute. Diagnose each one in `exercises/`.

## See also

- **`08_reproducibility`** — lockfiles, pinning, and "works on my machine" are largely the same problem, viewed from two different modules.
- **`09_refactoring_technical_debt`** — an unmaintained or unnecessary dependency you decide to remove later is exactly the kind of debt that module covers.
- **`language_primer`**'s setup notes already have you running `pip install` and `npm install` in practice — this module is where those commands actually get explained.

## Resources

- [Semantic Versioning 2.0.0](https://semver.org/) - the official semver specification, in full.
- [npm Docs: About package.json](https://docs.npmjs.com/cli/v10/configuring-npm/package-json) - the real reference for the manifest format described above.
- [The npm "left-pad" incident, explained (Wikipedia)](https://en.wikipedia.org/wiki/Npm_left-pad_incident) - the full story behind this module's transitive-risk example.
