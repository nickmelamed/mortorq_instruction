# 10 - Reading Unfamiliar Code

## New Team Reading Code

Imagine this scenario: every year, the students who wrote large parts of last season's codebase graduate, and the students who remain (or are brand new) inherit it, cold, with no one around who can just explain it out loud. This isn't a hypothetical scenario for our team, or any other FRC team.

## Don't Rewrite Before You Understand

There's a classic bit of reasoning called **Chesterton's Fence**: if you come across a fence in the middle of a field with no obvious purpose, the correct move isn't to tear it down because you can't see a reason for it, but instead to find out why it was built. You've already seen this in this curriculum: this module's own `Arm.REST_ANGLE_DEGREES = 47` looks, at a glance, like an arbitrary number you could round off or "clean up", until you read the comment explaining it encodes real, hard-won knowledge from actual testing. `04_documentation`'s `FLYWHEEL_RPM = 4500` is the same kind of number, but with a twist worth noticing: as shipped, the code has no comment on it at all yet. That absence isn't evidence the number is arbitrary; it's a fence with no sign on it, and `04`'s own exercise is built entirely around noticing that gap and writing the reason down, instead of assuming a missing comment means there was never a reason to begin with. Code that looks bad is not the same thing as code that's wrong; figure out which one you're looking at *before* you touch it.

## How to Orient Yourself

1. **Read the README, if one exists** (`03_file_project_structure`, `04_documentation`). If there isn't one, that's information too; it means nobody's written down the "what/how" yet, and you should expect to reconstruct it yourself as you go.
2. **Find the entry point.** Every runnable project starts somewhere. Find it before reading anything else.
3. **Start from the tests, if there are any.** A test is a description of expected behavior that's actually been checked. Also, no tests is information too, because it tells you which parts haven't been verified. 
4. **Use search tools before reading linearly.** Don't start at the top of the biggest file and read to the bottom. Use `grep`/`find` (`01_shell_cli_literacy`) to search for the specific thing you're trying to understand — a function name, a class, a keyword like `TODO` — and let that pull you directly to the relevant lines.
5. **Sketch the pieces and how they connect, before changing anything.** What are the main components? What calls what? Where does data enter, and where does it end up? You don't need a formal diagram; even writing these things down on a sheet of paper can go a logn way. 

## Putting it together

Open `examples/inherited_robot_code/`. This is a small, working, completely undocumented project with no README, one file whose tests exist and several whose don't, and at least one function nobody actually calls anymore. Before you touch a single line, work through `exercises/exercise-1-orient-in-the-codebase.md`.

## See also

- **`01_shell_cli_literacy`** — the `grep`/`find` skills this module's step 4 depends on directly.
- **`03_file_project_structure`** — reading a layout as a map, and finding an entry point, both practiced here at full scale.
- **`04_documentation`** — reading documentation (and the absence of it) efficiently.
- **`09_refactoring_technical_debt`** — "don't rewrite before you understand" is the same caution that module's incremental-refactoring discipline is built on.

## Resources

- [Understand Legacy Code](https://understandlegacycode.com/) - a real, ongoing resource entirely dedicated to exactly this skill, well beyond what a single module can cover.
- [Farnam Street: Chesterton's Fence](https://fs.blog/chestertons-fence/) - a fuller treatment of the reasoning this module's "resist the urge to rewrite" section is built on.
