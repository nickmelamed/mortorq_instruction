# 06 - Debugging Methodology

## Debugging is a method, not a mood

The most common way to debug badly is to change something, rerun, see if the symptom went away, and repeat — with no real theory of what's wrong, just hope. This sometimes "works," in the sense that the symptom eventually disappears, but it frequently leaves the actual bug in place, hidden behind a second bug that happens to cancel it out, or "fixed" in a way nobody can explain later. This module is a repeatable method that replaces guessing with a sequence of falsifiable steps — and, separately, the mechanics of the tools (`pdb`, browser DevTools, an IDE debugger) that make the method easier to carry out.

## The five-step loop

1. **Reproduce.** Find a reliable way to trigger the bug on demand. If you can't make it happen consistently, you have no way to confirm later that you actually fixed it, rather than got lucky once.
2. **Isolate.** Shrink the problem to the smallest case that still shows the bug — the fewest lines, the smallest input, the fewest steps. A bug in a 200-line function is much harder to reason about than the same bug once you've narrowed it to the 5 lines that actually matter.
3. **Hypothesize.** State one specific, falsifiable guess about the cause — not "something's wrong with the loop," but "the loop includes the last element twice because the upper bound should be exclusive." A hypothesis you can't imagine being proven wrong isn't a hypothesis, it's a shrug.
4. **Test.** Check the hypothesis directly — print the value, inspect it in a debugger, add an assertion — instead of staring at the code and reasoning about what it *probably* does. Code frequently doesn't do what it looks like it does; that gap is usually the entire bug.
5. **Fix.** Make the smallest change that addresses the *confirmed* cause, then rerun your step-1 reproduction case to confirm it's actually resolved — not just that the specific symptom you were staring at went away.

If a hypothesis turns out wrong in step 4, that's not a failure — it's information. Go back to step 3 with a narrower, better-informed guess. This loop is meant to be run several times in a row on a stubborn bug, not completed in one pass.

## Reading stack traces without panicking

A stack trace is a map of exactly which function called which other function, all the way down to wherever the program actually failed — it's one of the most useful debugging tools you have, and it's most useful once you know how to read it instead of reflexively scrolling past it.

**Python** prints frames top to bottom in call order, with the actual exception type and message *last*, at the very bottom:

```text
Traceback (most recent call last):
  File "scouting_report.py", line 27, in <module>
    report = build_report(team_lookup, entries)
  File "scouting_report.py", line 12, in build_report
    lines = [format_scouting_entry(team_lookup, e) for e in entries]
  File "scouting_report.py", line 7, in format_scouting_entry
    name = get_team_name(team_lookup, team_number)
  File "scouting_report.py", line 2, in get_team_name
    return team_lookup[team_number]
KeyError: 254
```

Read Python tracebacks **bottom-up**: start at the exception type and message (`KeyError: 254`), then walk upward through the call chain (`get_team_name` -> `format_scouting_entry` -> `build_report` -> the `main` block) to see exactly how execution got there. **Java** conventions put the exception type and message *first*, with the call chain below it, innermost call first (`at com.example.Foo.bar(...)`, then whoever called `bar`, and so on) — read Java stack traces **top-down** instead. The convention differs, but the goal is identical either way: find the exact line where things broke, then trace backward through *your own code's* frames (skip past library/framework frames you didn't write, unless nothing in your own code explains it) to understand how you got there. And a critical habit either way: **the line where the error was thrown is not necessarily the line where the mistake was made** — `get_team_name` above threw the error, but the actual mistake (an `int` team number sitting next to `str` keys) happened earlier, wherever that data was first put together.

## Bisection: finding *when* something broke

Sometimes you don't have a single crash to chase — you have a vague sense that "this used to work, and now it doesn't," with no idea which of the last dozen changes is responsible. Checking every change one at a time, in order, is the slow way to find it. **Bisection** (binary search applied to debugging) is much faster: check the *middle* of the range between "known good" and "known bad," and let the result cut the remaining search space in half every time, exactly the way you'd search a sorted list. Git has this built in directly — `git bisect` walks you through exactly this process across your commit history, and `git bisect run` can even automate it against a test script (see `git_resources` for the actual command). You don't need git to use the underlying idea, though: commenting out the second half of a long function to see if a bug persists in the first half alone is the same technique, applied by hand.

## The mechanics: a debugger, in whatever language you're using

Nothing else in this curriculum currently walks through how to actually use a debugger, so here's enough to start:

- **Python — `pdb`.** Insert `breakpoint()` directly in your code (or run `python3 -m pdb your_script.py`) and execution pauses there, dropping you into an interactive prompt. The commands you'll use constantly: `n` (next line), `s` (step into a function call), `c` (continue until the next breakpoint or the program ends), `p <expr>` (print a value), `l` (list the surrounding code).
- **Browser — DevTools.** Open DevTools (F12, or right-click -> Inspect) and go to the **Sources** panel. Click a line number to set a breakpoint directly in your actual running JavaScript; when execution hits it, you get the same kind of pause-and-inspect access `pdb` gives you, plus a live **Console** to evaluate expressions in the paused context.
- **Java — an IDE debugger.** Unlike `pdb`, Java debugging is almost always done through an IDE (IntelliJ, VS Code with the Java extension) rather than a standalone command-line tool: click in the gutter next to a line number to set a breakpoint, run in "debug mode" instead of "run," and the IDE pauses there with the same step/continue/inspect controls, presented visually instead of as commands you type.

All three are the same idea wearing different clothes: pause execution at a specific line, look at what the program actually believes right now, and step forward one line (or one function call) at a time until reality stops matching your expectation.

## Putting it together

Two separate exercises practice two separate halves of this module: `examples/stack_trace_bug/` is a real crash with a real traceback to read and fix using the five-step loop; `examples/bisect_the_regression/` is a function that quietly broke several revisions ago, for you to find using bisection instead of checking every version one at a time.

## See also

- **`01_shell_cli_literacy`** — reading a traceback in a terminal and running `python3 -m pdb` both assume the comfort this module treats as a soft prerequisite.
- **`systems_primer/06_testing_debugging`** — that module is about *catching* bugs before they ever happen, through unit tests and simulation. This module is about what you do once one has already happened.
- **`07_testing_philosophy`** — a good test suite is frequently what tells you a bug exists in the first place, and turns "isolate" (step 2, above) into something close to automatic.
- **`git_resources`** — the real `git bisect` command this module's bisection section is modeled on.

## Resources

- [Python docs: pdb — The Python Debugger](https://docs.python.org/3/library/pdb.html) - the official reference for every `pdb` command mentioned above.
- [Chrome DevTools: Debug JavaScript](https://developer.chrome.com/docs/devtools/javascript/) - the official walkthrough of the Sources-panel breakpoint workflow described above.
- [git bisect documentation](https://git-scm.com/docs/git-bisect) - the real command this module's bisection technique is based on.
