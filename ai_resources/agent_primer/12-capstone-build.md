# 12 Capstone Build

## Assembling the Pieces

Your finished scouting agent should be a single, coherent system where each earlier module's piece is a visible, working part - not seven separate demos bolted together. Concretely, that means:

1. **Tool layer** (`04`): at least one real tool with a well-written schema - name, description, and typed parameters that actually reflect what it does and its limits.
2. **Planning layer** (`05`): the agent should handle a genuinely multi-step goal (an alliance-pick recommendation, or similar) by reasoning and acting across several tool calls, not just answering from a single lookup.
3. **Memory layer** (`06`): the agent should be able to answer at least one question that requires recalling something from *outside* the current conversation - a past event, a season-long trend - using the schema you designed.
4. **Orchestration layer** (`07`, optional but recommended): if you built the supervisor/worker split, the data-fetching and strategy-reasoning responsibilities should visibly live in separate contexts, with the worker returning a distilled summary rather than raw dumps.
5. **Guardrails** (`08`): at least one guardrail should be demonstrable, not just described - a cap on tool calls or cost, a check that rejects a hallucinated or missing result, or a defense against an injected instruction.
6. **Observability layer** (`09`): the agent's tool calls and reasoning steps should be logged in a structured, traceable format - you should be able to pull up the record for one specific past run and point to exactly which step produced a given output.
7. **Human-in-the-loop gate** (`10`): the highest-stakes action your agent can take (almost certainly "message the drive team" or equivalent) must stop at an explicit approval point before it happens, with a real approve/edit/cancel choice presented.

It's fine if your implementation is a chat-simulated version of some of these pieces (you invented tool results by hand, or you role-played the supervisor/worker split across two conversations) rather than fully wired-up code - what matters is that each piece is demonstrated working, with a real input and a real, checkable output, not just asserted in a slide.

As you actually build these seven pieces, use a real agentic coding tool per `11-agentic-coding-tools.md` rather than writing everything by hand: set up a project rules file for your capstone's repo so the tool isn't re-taught the same conventions every session, review every generated diff (not just the tool's summary of it) before accepting it, and if the build spans more than one sitting, write a handoff doc at the end of a session instead of starting the next one from scratch.

## Rubric

Use this to self-assess before presenting, or as the basis for grading if this is being assessed formally:

| Criterion | What "meets it" looks like |
| --- | --- |
| Uses tools correctly | At least one tool with a clear schema; the agent calls it with valid arguments and reasons correctly over both successful and failed results |
| Plans sensibly | Handles a multi-step goal by reasoning and acting across steps (ReAct or plan-and-execute), not a single lookup dressed up as a "recommendation" |
| Has memory across matches | Can answer at least one question that requires recalling something from a past session, using a schema with a justified, bounded field list |
| Has at least one guardrail | Can demonstrate a specific failure being caught, not just a claim that guardrails exist |
| Has observability | Can pull up a structured log or trace for one specific past run and point to exactly which step produced a given output, not just describe logging in the abstract |
| Has a human-approval gate | At least one real-world-reaching action stops for explicit approval, with the actual approval prompt shown, before proceeding |
| Built with real tool practices | Can show an actual project rules file for the capstone repo, and describe one specific diff they personally reviewed and changed or rejected before accepting it, not just a claim that a coding agent was used |
| Presentation is honest about limits | The presenter can say, specifically, what the agent still gets wrong or doesn't handle - not just what it does well |

That last row matters as much as the other seven. Everything in `08-guardrails-failure-modes-and-eval.md` was about not trusting an agent by default - a presentation that can't name its own agent's weak points hasn't actually internalized that module.

## Build It

Assemble and present your version of the scouting agent.

1. Walk through your agent live (or via a recorded/simulated transcript if live tool access isn't available), demonstrating each of the seven layers above in action, in order.
2. For the guardrail demonstration specifically: show the failure happening *without* the guardrail (or describe exactly what would have happened), then show the guardrail catching it.
3. For the observability demonstration specifically: pick one specific run (ideally the one from step 2) and show the actual log or trace for it, pointing to the exact entry that explains the outcome.
4. For the approval gate specifically: show the actual gate text the agent presents, and both an "approved" and a "rejected/edited" path through it.
5. For the tool-practice demonstration specifically: show your capstone repo's project rules file, and walk through one real diff you reviewed - what the tool changed, what you questioned or rejected, and why.
6. Close with a short, honest limitations section: at least two things your agent does not handle well, and what you'd build next (module-style) to address each one.
7. Score your own build against the rubric above before anyone else does - mark each row as met, partially met, or not met, and be ready to defend any "partially met."
