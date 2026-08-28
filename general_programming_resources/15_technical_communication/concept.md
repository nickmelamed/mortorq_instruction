# 15 - Technical Communication

## Different Audiences, Different Jobs

`04_documentation` already covers writing for someone who's going to open your code. This module is about a different reader, one who's never going to open the file at all. Think a non-programming mentor deciding what to prioritize, a judge scoring your notebook, a teammate reviewing a PR without three hours of context you have and they don't. For that reader, what you write or say is the only thing they have to go off of. 

## Abstraction is a Spectrum

The instinct when explaining something technical to a non-technical person is to either drown them in implementation detail or oversimplify until the explanation is wrong. Abstraction level is not a binary choice between "the whole truth" and "a lie for beginners." Before you write or say anything, name the one decision or belief you need this specific reader to walk away with, then include only what actually serves that.

Take the climber tolerance decision from `13_designing_under_constraints`'s exercise 3. Here's the same fact at two settings of the dial:

For a fellow programmer, who needs to be able to change this code later:
> "The climber's success check uses `abs(currentHeight - targetHeight) <= TOLERANCE_INCHES`, with `TOLERANCE_INCHES = 0.5`. Encoder noise alone is usually under 0.1 inches, so 0.5 gives margin without loosening the check enough to false-positive on a partial climb."

For a mentor or judge, who needs to know you made a deliberate, defensible choice — not the exact constant:
> "The climber doesn't need to be perfectly level to score — being off by up to half an inch doesn't cost points, and demanding more precision than that would just make every climb slower for no scoring benefit. So we built in that margin on purpose instead of chasing exact placement."

Both are true. Neither is a lie for the audience it's aimed at. The second one just leaves out the exact constant name and the encoder-noise justification, because the judge's decision ("did this team think carefully about this tradeoff?") doesn't depend on that detail.

## Lead with the Conclusion

Once you know what the reader needs to walk away with, say it *first*. Like with a resume, a busy reader doesn't want to sift through your entire thought process before finding what happened. Put the outcome or the ask there, and let the chronology, if it matters at all, come after:

> Bad: "We started by trying a simple P-only controller on the climber, but it oscillated near the top, so we added a D term, which helped but still overshot on the first attempt because the gains were tuned for a lighter robot, so after re-tuning against the actual competition weight..."

> Better: "Climber now reaches its target height reliably, ±0.5in, in under 2 seconds. Got there by adding a D term and re-tuning both gains against the competition-weight robot instead of the practice one — the practice bot's lighter weight was masking overshoot the whole time."

The second version front-loads the one sentence a skimming reader actually needs, then earns the rest of the reader's attention with the interesting part.

## A PR description is a Communication Artifact

`git_resources/CONTRIBUTING.md` already requires a PR description. What it doesn't tell you is how to think about filling it in well, and it's easy to satisfy the letter of that checklist while still writing something useless:

> Bad (technically has all three, tells the reviewer nothing): "What: changed the climber code. Why: it wasn't working. How to test: run it and see."

> Better: "What: added a D term and re-tuned PID gains for the climber's height controller. Why: it consistently overshot the target height on the competition-weight robot — gains were still set from testing on the lighter practice bot. How to test: run the climb routine on the comp bot; height should settle within ±0.5in inside 2 seconds with no visible overshoot."

The difference isn't length, it's whether a reviewer who wasn't in the room for the debugging session can actually use what you wrote; to understand the change, to know why it's needed, and to verify it themselves. That's the same "lead with the conclusion" and "pick the right abstraction level" thinking from the last two sections, aimed at your team's specific PR checklist instead of a status update or a judge.

## FRC's Version: Engineering Notebooks and Judge Interviews

Everything above shows up at its highest stakes in an FRC engineering notebook and the judging interview built on it. Judges are technically literate — they've seen dozens of robots — but they are not embedded in your codebase or your season, and they have minutes, not hours, per team. A notebook entry that dumps implementation detail with no framing loses exactly as many points as one with no technical substance at all; both fail to answer the question a judge is actually there to ask, which is closer to "did this team understand the problem they were solving and make a defensible choice" than "can this team recite what the code does."

The shape that actually answers that question, every time: **problem → constraint → decision → why.** What were you trying to solve, what limited your options, what did you choose, and why that choice over the alternatives. That's sections 2 and 3 of this module — the right abstraction level, stated up front — applied at the moment it matters most.

## Putting it together

`examples/messy_pr_description.md` has all the *appearance* of following the checklist and still tells a reviewer nothing useful; `examples/messy_notebook_entry.md` narrates a whole debugging saga in chronological order without ever stating what was actually decided or why. Both go to `exercises/`, where you rewrite them. `exercise-4-live-judge-questions.md` is different from the other three on purpose — it's a live, partner-based drill instead of a written rewrite, since a real judging interview never gives you the chance to revise an answer before someone hears it.

## See also

- **`04_documentation`** — the sibling skill, for the reader who *will* open your code. Read that module's "what vs. why" comment guidance before this one if you haven't.
- **`git_resources/CONTRIBUTING.md`** — the actual PR format and checklist this module's PR section builds on; that document is the source of truth for the mechanics, this module is the thinking behind them.
- **`13_designing_under_constraints`** — the climber tolerance decision reused throughout this module as the running example; read that module first if the example above didn't make sense on its own.
- **`14_building_with_intent`** — a goal metric, defined before you start, is the concrete answer to the "why" this module's problem → constraint → decision → why shape asks a judge to evaluate.
- **`17_pair_programming_and_workflow`** — `exercise-4`'s live, partner-based drill borrows that module's driver/navigator pattern directly, aimed at a judging interview instead of a codebase.

## Resources

- [Google's engineering practices: How to write a CL description](https://google.github.io/eng-practices/review/developer/cl-descriptions.html) - Google's own internal guidance on exactly the "what/why, written for a reviewer who wasn't there" skill this module's PR section teaches, from a much larger engineering org.
- [The Pyramid Principle (summary)](https://en.wikipedia.org/wiki/Barbara_Minto) - Barbara Minto's classic "conclusion first, supporting detail after" framework for technical and business writing; the idea underneath this module's "lead with the conclusion" section.
