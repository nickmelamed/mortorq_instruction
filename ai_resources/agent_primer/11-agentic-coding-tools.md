# 11 Agentic Coding Tools

## Beyond the README's Mention

The README introduced Claude Code, Cursor, and Codex as "coding agents" that go beyond autocomplete, able to write, debug, and test code, completing tasks in parallel. Everything covered since then is exactly what's running under the hood of tools like these. This module treats them properly, as an application of everything you've now learned. Specifically, four concrete features (project rules files, handoff files, plan mode, subagents) that are each a real, nameable instance of a concept from an earlier module, not a new idea to learn from scratch.

## How This Differs from Autocomplete

Autocomplete-style tools (like GitHub Copilot's inline suggestions) predict what you're about to type, one completion at a time, based on the surrounding code. An agentic coding tool is given a goal instead of a cursor position: "add a timeout guard to this drive command," "find every place we hardcoded a motor ID and pull it into a constants file." It then runs its own version of the agent workflow from `01-agent-basics.md`: it reads relevant files, plans an approach, makes edits, and can run tests or a build to check its own work. This is all done with tools it's calling, the same mechanism from `04-tool-use-and-function-calling.md`, just aimed at your filesystem, a shell, and a test runner instead of a scouting API - often connected via MCP (also covered in `04`), which is how these tools plug into external systems beyond what ships built in.

## Acting in Parallel Across a Codebase

"Acting in parallel" means the agent isn't limited to one file at a time the way a human editing in sequence is. A single instruction like "rename `MAX_SPEED` to `MAX_DRIVE_SPEED` everywhere and update anything that depends on the name" might touch a constants file, three subsystem files, and a test file, all as part of one coherent task. The agent plans the full scope of the change before making any single edit, rather than you manually finding and fixing each usage yourself.

This is powerful specifically because FRC codebases tend to have exactly this shape: a change to a shared constant, a shared interface, or a subsystem's public method often ripples out to every command that uses it. A tool that can see and coordinate that whole ripple in one pass is doing something meaningfully different from faster typing.

## Project Rules Files: Standing Context for a Repo

Recall from `03-context-engineering.md`: system instructions placed early in context act like standing law, and the right-altitude problem: too rigid breaks on edge cases, too vague causes unpredictable improvisation.

A **project rules file** (Claude Code's `CLAUDE.md`, Cursor's `.cursor/rules`, or the `AGENTS.md` convention several tools now share) is a file that lives in your repo, gets checked into git like any other file, and is loaded into the agent's context automatically at the start of every session. It's the practical, persistent version of "system instructions" from `03`: instead of re-explaining your codebase's conventions in every single prompt, you write them once and the tool reads them every time, on every task, without you retyping anything.

For an FRC codebase, a rules file typically states things like:

```markdown
# CLAUDE.md

- WPILib Java robot project, command-based structure.
- Motor CAN IDs live only in `Constants.java` - never hardcode one elsewhere.
- Run `./gradlew test` before considering any change finished.
- Do not modify anything under `vendordeps/` without asking first.
```

This is the right-altitude problem from `03` playing out for real. A useful rules file is specific, checkable rules; a command to run, a file boundary, a naming convention

A rules file also isn't a one-time setup cost you write and forget. If you notice the agent repeatedly making the same wrong assumption, the fix belongs in the rules file, not in a one-off correction you retype every session.

## Handoff Files: Continuity Across a Context Window

Recall from `02-tokens-and-context.md`: a context window has a hard limit, and once a conversation runs long enough, older content gets compressed or dropped, even if the task isn't completed. 

A **handoff file** solves a different problem than a project rules file, and the two are easy to conflate because both are files you hand the agent. A rules file is standing context: the same at the start of every session, regardless of task. A handoff file is task-specific and temporary: a short document (often literally named `HANDOFF.md`, sometimes just a final message) that captures where one particular piece of unfinished work stands right now so that a brand-new session, with a completely empty context window, can pick the task back up without you re-explaining everything from scratch.

This comes up constantly in practice: you're deep into a multi-file refactor, the session has gotten long enough that the agent is starting to lose track of earlier decisions (the same consistency problem from `ai_primer/03-multi-turn.md`, compounded by a much longer agent session), and rather than pushing the same context further past its useful point, you have the agent write a handoff doc and start clean:

```markdown
# HANDOFF.md - Drivetrain Constants Refactor

Done: moved all CAN IDs from DriveSubsystem.java into Constants.java.
Left: three vendor command files still reference the old hardcoded IDs directly -
  ClimbCommand.java, IntakeCommand.java, AutoBalanceCommand.java.
Decision: kept the old constant names as-is rather than renaming, to limit the diff size.
Do not touch: vendordeps/, per the project rules file.
```

A new session that starts with this doc in context has what it needs to keep going, without carrying forward the (possibly degraded, possibly cluttered) context of the session that wrote it. This is the scratchpad idea from `03-context-engineering.md`, deliberately made durable and portable across a context-window boundary, rather than just useful within one session.

## Plan Mode: An Approval Gate for Code

Recall from `10-human-in-the-loop-design.md`: an approval gate is a designed stopping point where the agent presents what it's about to do and waits for explicit human confirmation before proceeding.

Most agentic coding tools have some version of a **plan mode** (sometimes called "ask before edit"): the agent reads the relevant files and proposes a plan, or even a full diff, without writing anything to disk, until you explicitly approve it. This is exactly `10`'s approval-gate pattern, applied to file edits instead of a message to a drive team.

Plan mode moves the review point to before the edit happens.

## Subagents: Splitting a Big Task Across Workers

Recall from `07-multi-agent-systems.md`: a supervisor delegates narrow, well-scoped jobs to worker agents, each with its own clean context, rather than one agent carrying an entire task alone.

Some agentic coding tools let you spin up **subagents** for exactly this reason: one agent searching the codebase for every usage of a deprecated method while a separate one writes the replacement, or one agent running the test suite and reporting failures while the supervising agent decides what to fix next. The same tradeoff from `07` applies here: splitting is worth it when the sub-tasks have a genuinely different *character* (broad search vs. careful judgment, mechanical renaming vs. verifying nothing broke), not just because a task happens to have multiple steps.

On a real repo, this shows up on large refactors: a rename that touches dozens of files can be split so one worker handles the mechanical part while another verifies the result, instead of a single agent context trying to simultaneously hold multiple responsibilities.

## Reviewing What a Coding Agent Did

Plan mode gives you a review point *before* an edit happens. This section is about the review that still has to happen *after*. Everything from `08-guardrails-failure-modes-and-eval.md` about not trusting agent output by default applies directly here, in a form you can check concretely: code either compiles and passes tests, or it doesn't; it either matches what you actually meant, or it doesn't. That checkability is exactly why review has to happen anyway.

Reviewing a coding agent's output means:

- **Read the diff, not just the summary** - the agent's own description of what it changed can be wrong or incomplete in exactly the way any LLM output can be wrong (recall hallucination from `ai_primer/00-ai-for-programming.md`); the diff is the ground truth, not the agent's account of the diff
- **Check the edges, not just the happy path** - did it handle the case where a sensor value is out of range, or only the case it was directly asked about?
- **Run it** - actually build and test the change, on real hardware or in simulation, exactly as `ai_primer/06-thought-process.md`'s "Verify, Don't Trust" already told you to do for chatbot code; an agentic tool making the edit itself doesn't remove that requirement, if anything it matters more since the agent may have touched files you didn't look at yourself
- **Understand every line before accepting it** - if the agent's change works but you can't explain why, that's a flag to ask it to explain, not to move on; you're still the one who has to debug this robot at 2am before a match

## Try It

This has three parts: reviewing a real change, testing whether a project rules file actually changes agent behavior, and testing whether a handoff file actually preserves continuity across a fresh session. Use Claude Code, Cursor, or an equivalent agentic coding tool, and a real (non-critical, ideally already-committed-and-backed-up) piece of your team's actual robot codebase for all three.

### Part 1: Review a Real Change

1. Give the tool a real, scoped task. This could be something like "add a null/range check to [a specific sensor-reading method] and explain why it's needed" or "find every hardcoded PID constant in [a specific subsystem] and pull them into a constants file." Keep the scope small enough to review in one sitting. \\
2. Before accepting anything, read the full diff line by line. For each changed file, identify: what changed, why (in your own words, not the agent's summary), and whether it's actually correct. \\
3. Find at least one thing you'd want to change, question, or reject before accepting. This could be a naming choice, an edge case it missed, a change that went further than you asked, or (if you genuinely can't find anything) an edge case you deliberately test to make sure it was actually handled and not just assumed. \\
4. Only after that review, build and run the affected code (or the relevant tests) yourself, and confirm the real behavior matches what the diff claims to do. \\

Write down one specific thing the tool did that you would not have caught just by reading its own summary of its changes; something you only caught by reading the actual diff or by running it yourself.

### Part 2: Test a Project Rules File

1. Find one real convention in your team's codebase that a coding agent could plausibly get wrong. Perhaps where constants live, a required test/build command, a directory it shouldn't touch, a naming pattern you actually follow. Pick something specific and checkable, not a vague preference. \\
2. With **no rules file in place**, give the agent a task that would naturally run into that convention (e.g., "add a new motor and wire it into the drivetrain subsystem" if your convention is "CAN IDs only live in `Constants.java`"). Record whether it followed the convention or not. \\
3. Write a short project rules file (5-10 lines, following the format in this module) that states that convention specifically and directly. \\
4. Run the same task again, fresh, with the rules file in place. Record whether behavior changed. \\

Answer in two or three sentences: did the rules file change the outcome? If it didn't, was your rule too vague (the right-altitude problem from `03-context-engineering.md`) or was the task not actually related to the rule you wrote? If you have time, rewrite the rule and re-test once more.

### Part 3: Test a Handoff File

1. Start a real multi-step task with the agent. This should be something with at least 3-4 distinct sub-steps (the constants refactor from earlier in this module works well, or use your own). \\
2. Deliberately stop partway through, before the task is finished, and ask the agent to write a handoff doc summarizing exactly what's done, what's left, and any decisions made so far. Do not do a full re-explanation of the codebase, just this task's state. \\
3. Start a **completely fresh session** (new conversation, empty context window) and give it only the handoff doc, not the prior conversation, not a re-explanation from you. Ask it to continue the task. \\
4. Compare: did the new session pick up correctly? If it made a mistake or asked a question the first session had already resolved, find the specific gap. Was it missing from the handoff doc, or present but misread?

Write down one sentence naming the single most important piece of information your handoff doc had to include for the fresh session to succeed, and what would have gone wrong without it.

## Resources

- [How Claude Remembers Your Project](https://code.claude.com/docs/en/memory) - official docs for CLAUDE.md and project memory, the real version of this module's project-rules-file example (docs)
- [Rules | Cursor Docs](https://cursor.com/docs/rules) - Cursor's equivalent official docs for project rules files (docs)
