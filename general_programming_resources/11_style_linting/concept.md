# 11 - Style & Linting as a Collaboration Tool

## Bikeshedding

There's a well-known term, **bikeshedding**, that comes from a parable. It's about a committee that spends more time arguing over the paint color of a bike shed than approving a nuclear reactor design, because the paint color is the one thing everyone feels qualified to have an opinion about.

 This is exactly what happens when a team has no automated standard for code style: tabs vs. spaces, single vs. double quotes, where the opening brace goes. None of these choices meaningfully affect whether the code works, which is precisely why they generate disproportionate, endless debate ("how many indentations do you use").

 The solution is to pick a style, stick to it, and automate it. 

## Formatter vs. linter: two different tools

These get used interchangeably in conversation, but they do genuinely different jobs:

- A **formatter** (Prettier for JS/TS, Black for Python, `google-java-format` for Java, `clang-format` for C++) rewrites your code's whitespace, line breaks, quote style, and similar cosmetic details to match one consistent style, automatically. It is purely for aesthetic changes. 
- A **linter** (ESLint, Pylint/Ruff, Checkstyle) analyzes your code for actual potential problems: an unused variable, unreachable code after a `return`, comparing values with the wrong equality operator, a variable that shadows an outer one. A linter can be wrong about style opinions too, but its more valuable job is catching things that are probably *bugs*, not just inconsistencies.

Both get run automatically — on save, in your editor, or as an automated check before code is allowed to merge — specifically so no one has to remember to do it, or debate it, by hand.

## The real payoff: diffs and reviews

Here's the concrete reason this matters, beyond aesthetics: **version control tracks changes line by line**, and a diff is only useful if it shows the lines that actually changed *in meaning*. If two people format code differently, a single one-line logic fix can turn into a diff touching dozens of lines, because the tool has no way to distinguish "this line's meaning changed" from "this line just got re-indented." That makes a code review dramatically harder. 

Automated, consistently-applied formatting is what keeps a diff limited to *only* the lines that actually changed, which is exactly what makes reviews in `git_resources` (and real pull requests anywhere) fast and trustworthy instead of exhausting.

## Consistency matters more as a team grows

Working alone, your personal style preference is the only one that matters. The moment more than one person touches the same codebase, "what do I personally prefer" stops being the relevant question. You now have to consider what styles will work for your team. 

A consistent style, enforced by a tool rather than by memory or manual review comments, is what makes a codebase feel like it was written by one disciplined author instead of a patchwork of different habit, even when it was written by an entire team across several years.

## The mechanics, briefly

You don't need to memorize configuration syntax for any of these, just recognize the names: **Prettier** (JS/TS/CSS formatting), **ESLint** (JS/TS linting), **Black** (Python formatting, deliberately near-zero-configuration by design), **Ruff** (a fast modern Python linter, increasingly also doing some formatting), **Checkstyle**/`google-java-format` (Java), and **clang-format** (C++). Most of these integrate directly into an editor (format-on-save) or run automatically before code merges, so that using them correctly mostly just means *not turning them off*.

## Putting it together

Open `examples/style_diff/`. You'll see three versions of the same tiny function. `v2_mixed_change.py` makes one real behavioral change to `v1_original.py`, but an editor's auto-formatting also silently changed unrelated quote styles in the same file at the same time. `v3_clean_change.py` makes the *exact same* real change, with the surrounding style left untouched. Diff both against the original in `exercises/exercise-1-find-the-real-change.md` and see the difference for yourself. That exercise is entirely about the formatter half of this module; `exercise-2-run-a-real-linter.md` picks up the linter half against `examples/lint_catches/scouting_lookup.py`, three real bugs a real linter actually catches.

## See also

- **`git_resources`** — the pull-request review workflow this module's "diffs and reviews" section is directly about.
- **`09_refactoring_technical_debt`** — "never mix a refactor with a feature change" is the same discipline this module applies specifically to formatting: never let a reformat hide inside a real logic change.
- **`01_shell_cli_literacy`** — `diff`, used directly in this module's exercise, is one more search/inspection tool worth having alongside `grep` and `find`.

## Resources

- [Prettier: Why Prettier?](https://prettier.io/docs/en/why-prettier) - the formatter project's own case for automated formatting, in its own words.
- [Black: The Uncompromising Code Formatter](https://black.readthedocs.io/en/stable/) - Python's dominant formatter, and a good example of a tool deliberately designed to remove style debate entirely by offering almost no configuration.
