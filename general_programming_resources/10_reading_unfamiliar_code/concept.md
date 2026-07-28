# 10 - Reading Unfamiliar Code

## The problem this curriculum actually has, every single fall

Every FRC team has the same recurring event: the students who wrote large parts of last season's codebase graduate, and the students who remain (or are brand new) inherit it, cold, with no one around who can just explain it out loud. This isn't a hypothetical scenario invented for this module — it's the single most predictable moment of every season, and it's exactly why this module exists. Everything else in this folder — `01_shell_cli_literacy`'s search tools, `03_file_project_structure`'s "read the layout as a map," `04_documentation`'s "read docs efficiently," `09_refactoring_technical_debt`'s "don't rewrite what you don't understand yet" — was building toward this one moment. This module is where all four get used together, for real, at once.

## Resist the urge to rewrite before you understand

The single most tempting, and most dangerous, reaction to messy or confusing inherited code is "let's just rewrite this from scratch." Resist it until you actually understand *why* the code is the way it is. There's a classic bit of reasoning called **Chesterton's Fence**: if you come across a fence in the middle of a field with no obvious purpose, the correct move isn't to tear it down because you can't see a reason for it — it's to first find out why someone built it there, because the reason might be exactly the thing that breaks if you remove it. You've already seen this in this curriculum: `04_documentation`'s `FLYWHEEL_RPM = 4500` and this module's own `Arm.REST_ANGLE_DEGREES = 47` both look, at a glance, like arbitrary numbers you could round off or "clean up" — until you read the comment explaining that they encode real, hard-won knowledge from actual testing. Code that looks bad is not the same thing as code that's wrong; figure out which one you're looking at *before* you touch it.

## An orientation strategy, in order

1. **Read the README, if one exists** (`03_file_project_structure`, `04_documentation`). If there isn't one, that's information too — it means nobody's written down the "what/how" yet, and you should expect to reconstruct it yourself as you go.
2. **Find the entry point.** Every runnable project starts somewhere. Find it before reading anything else — it's the one thread guaranteed to connect to everything that actually matters.
3. **Start from the tests, if there are any.** A test is a description of expected behavior that's actually been checked, which makes it more trustworthy than a comment or a variable name — nobody can accidentally let a test's assertions go stale the way a comment can silently stop matching the code near it. Just as importantly: notice which parts have *no* test coverage at all. That's not neutral information either — it tells you which parts nobody's verified, which deserve extra caution.
4. **Use search tools before reading linearly.** Don't start at the top of the biggest file and read to the bottom. Use `grep`/`find` (`01_shell_cli_literacy`) to search for the specific thing you're trying to understand — a function name, a class, a keyword like `TODO` — and let that pull you directly to the relevant lines, across however many files, instead of reading everything in file order.
5. **Sketch the pieces and how they connect, before changing anything.** What are the main components? What calls what? Where does data enter, and where does it end up? You don't need a formal diagram — even a rough mental (or scratch-paper) map of "these are the pieces, this is roughly how they talk to each other" is enough to make your first real change a safe one instead of a guess.

## Putting it together

Open `examples/inherited_robot_code/` — a small, working, completely undocumented project with no README, one file whose tests exist and several whose don't, and at least one function nobody actually calls anymore. Before you touch a single line, work through `exercises/exercise-1-orient-in-the-codebase.md` — answer every question first, the same way you'd need to before making a real change to code you just inherited.

## See also

- **`01_shell_cli_literacy`** — the `grep`/`find` skills this module's step 4 depends on directly.
- **`03_file_project_structure`** — reading a layout as a map, and finding an entry point, both practiced here at full scale.
- **`04_documentation`** — reading documentation (and the absence of it) efficiently.
- **`09_refactoring_technical_debt`** — "don't rewrite before you understand" is the same caution that module's incremental-refactoring discipline is built on.

## Resources

- [Understand Legacy Code](https://understandlegacycode.com/) - a real, ongoing resource entirely dedicated to exactly this skill, well beyond what a single module can cover.
- [Farnam Street: Chesterton's Fence](https://fs.blog/chestertons-fence/) - a fuller treatment of the reasoning this module's "resist the urge to rewrite" section is built on.
