# 08 - Reproducibility

## "Works on my machine" is a diagnosis, not an excuse

Every "works on my machine" bug has the same underlying shape: your code secretly depends on something true about *your* machine right now — a package version, a file that happens to exist at a specific path, a random outcome that happened to go the way you expected, a timezone, a locale — without that dependency ever being written down anywhere. The fix is never "well, it works for me" — it's finding the hidden assumption and either removing it or writing it down explicitly, so the same result shows up for anyone, on any machine, every time.

## Environment pinning, briefly

`05_dependency_management` already covers this in depth: lockfiles pin the exact resolved version of every dependency, direct and transitive, so "install this project" means the same thing on every machine. The same idea extends one level further, to the **language runtime itself** — a `.python-version` file, an `.nvmrc` for Node, a declared JDK version in a Gradle build — pinning not just your packages but the interpreter/compiler running them, since behavior can genuinely differ between, say, Python 3.10 and 3.12. It's worth also watching for **environment variables that quietly affect behavior** without ever appearing in your code: a system's timezone (`TZ`) or locale (`LANG`) can silently change how dates format or how strings sort, differently on different machines, with nothing in your source code pointing at why.

## Seeding randomness

You've already seen this used, without necessarily noticing why: `02_code_organization_modularization`'s example code seeded its random number generator (`Random(42)` in Java, `random.seed(42)` in Python) specifically so its output would be identical before and after refactoring. Here's the actual mechanism: computers don't generate *true* randomness by default — a **pseudo-random number generator (PRNG)** produces a long, deterministic sequence of numbers that merely *looks* random, entirely determined by a starting value called a **seed**. Two runs given the same seed produce the exact same sequence, every time. Leave the seed unset, and most PRNGs default to seeding themselves from something like the current time, which is different every run — so "random" behavior becomes genuinely irreproducible, run to run. This is also directly why `07_testing_philosophy` calls out unseeded randomness as a common cause of flaky tests: a test that depends on an unseeded random value is, by construction, not deterministic.

## Why containers exist (the short version)

Pinning your packages and your language version still doesn't capture everything — the operating system itself, system libraries, installed command-line tools, and the filesystem layout around your project can all still differ between machines. A **container** (Docker being the dominant real-world tool) solves this by packaging the entire runtime environment your code needs — OS layer included — into one unit that runs identically anywhere a container runtime is installed. Think of a lockfile as a recipe that specifies the exact brand and quantity of every ingredient; a container ships the entire kitchen, stove included, so nothing about *where* it's cooked can introduce a difference either. This module isn't teaching you Docker itself (that's a deep, tool-specific topic on its own) — just the concept that pinning gets you most of the way, and containers exist for the remaining gap pinning alone can't close.

## Putting it together

Open `examples/practice_scheduler/schedule.py` — a small script that assigns robots to practice time slots. Run it twice and you'll notice two separate reproducibility bugs: the assignment order is different every time, and it crashes on a hardcoded path that only ever existed on whoever originally wrote it. Fix both in `exercises/`.

## See also

- **`05_dependency_management`** — lockfiles and version pinning, covered in full there rather than repeated here.
- **`07_testing_philosophy`** — unseeded randomness as a specific, common cause of flaky tests.
- **`02_code_organization_modularization`** — the seeded example you already ran, before this module explained why it was seeded.

## Resources

- [Reproducible Builds](https://reproducible-builds.org/) - a real, ongoing initiative (with major open-source projects participating) built entirely around the idea this module introduces, at a much larger scale.
- [Docker: What is a Container?](https://www.docker.com/resources/what-container/) - a short, official explanation of containers, if you want more than this module's one-paragraph version.
