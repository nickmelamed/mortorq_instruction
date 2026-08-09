# 10 Human-in-the-Loop Design

## Not Every Action Deserves the Same Trust

Recall from `ai_primer/03-multi-turn.md`: asking the model to explain its reasoning before changing code, rather than letting it rewrite freely, is an example of Human-in-the-Loop. That was a manual habit you chose to apply turn by turn in a chat. For an agent, human-in-the-loop has to be a designed part of the system itself: specific points, decided in advance, where the agent stops and waits for a person, rather than a habit you remember to apply.

After `08-guardrails-failure-modes-and-eval.md`, it should be clear why. An agent that can hallucinate a tool result, misread a stat, or act on injected content is an agent that will eventually be wrong in a way that matters. Human-in-the-loop design is about deciding, before that happens, which of the agent's actions are safe to let run unsupervised and which need a person to sign off first.

## Approval Gates

An **approval gate** is a designed stopping point: before the agent takes a specific kind of action, it presents what it's about to do and waits for explicit human confirmation, rather than proceeding on its own.

For the scouting agent, the natural gate is right where its output stops being internal analysis and starts reaching a real person who'll act on it:

```text
Agent: I've analyzed this event's data and I'm ready to recommend alliance picks.

  Draft message to drive team:
  "Recommend alliance picks: 1114 (90% climb rate, strong auto), 2056 (consistent
  scorer, no climb), 254 (reliable partner, historical data only - no matches at
  this event yet)."

  Send this to the drive team? [approve / edit / cancel]
```

Nothing about the agent's analysis work up to this point needed a gate. The gate belongs at the one step where the agent's output would otherwise reach a real person making a real decision in real time, with no chance to catch a mistake after the fact.

The approval prompt itself, and whatever the human decides, is exactly the kind of event `09-observability.md`'s logs should capture. It logs not just what the agent did, but when and how a human approved, edited, or rejected it, so that decision is auditable later too. Without that, "we have an approval gate" is a policy on paper, not something you could point to after the fact and say "here's what actually happened."

## Permission Scoping

**Permission scoping** is deciding, in advance, exactly what an agent is and isn't allowed to do without asking. A scouting agent might be scoped to:

- Freely: read match data, read scouting notes, draft recommendations, save analysis to its own memory
- Only with approval: send anything to the drive team, post anything publicly, overwrite a saved scouting record
- Never: modify past match results, contact anyone outside the team, spend money

Scoping it this precisely matters because "ask before doing anything important" is too vague to actually implement; it just relocates the right-altitude problem from `03-context-engineering.md` into the permission system instead of the instructions. A scope with real, named boundaries is something you can actually test and enforce; "use good judgment about what's important" is not.

A scope only holds if it survives being argued with. Recall the jailbreaking failure mode from `08-guardrails-failure-modes-and-eval.md`: a real, legitimate user, mid-conversation, asking the agent to skip a step "just this once." If the scope lives only as an instruction the model reads and can be talked out of under enough pressure, it hasn't actually moved the boundary out of the instructions at all; it's just moved a vaguer version of the same problem one layer down. A scope that matters is enforced by something outside the model's own in-the-moment judgment, which is exactly what sandboxing, next, is for.

## Sandboxing

**Sandboxing** means running an agent's actions in an environment where a mistake can't reach anything that actually matters, even before permission scoping or approval gates come into play. A coding agent that can freely read/write files in a scratch directory, but has no access to your team's actual competition-critical robot code repository, is sandboxed.

For the scouting agent, a sandboxed version might read from a copy of the season's scouting database rather than the live one the whole team edits during a match. So, if it writes a bad memory record (from `06-memory-systems.md`), it corrupts a copy.

Sandboxing and permission scoping work together, not as substitutes for each other: scoping controls what the agent is *told* it can do, sandboxing controls what it's *physically able* to reach even if something goes wrong with that first layer.

## When Should an Agent Ask vs. Just Act?

A working decision framework:

- **Reversible and contained** (only affects the agent's own working state - draft text, an internal analysis, a scratchpad note) → let it act freely
- **Hard to reverse, or reaches beyond the agent's own workspace** (a message sent to a person, a file outside its sandbox, spending real money or API budget) → require approval first
- **Uncertain which category an action falls into** → default to asking. The cost of an unnecessary approval prompt is a few seconds of a person's attention; the cost of an unapproved action that turns out to matter can be much larger.

We already use an analogous line of logic for autonomous mode: the robot executes a pre-set sequence without live driver input specifically because that sequence was tested and approved in advance to be safe to run unsupervised. An agent's approval gates work the same way.

This applies without exception once one of the agent's tools is a trained model instead of a rule-based lookup. A value or policy network's recommendation still reaches "a message sent to a person" the moment it influences what gets shown to the drive team, and a model's reasoning being harder to inspect than a hand-written formula is a reason for *more* scrutiny at the gate, not less. See `13-integrating-a-trained-model.md` for what changes (and what doesn't) once a real trained model is one of the agent's tools.

## Build It

Take the scouting agent as it stands after `09-observability.md` and design its human-in-the-loop layer.

1. List every distinct action the agent can take across modules 04-09 (e.g., calling `get_team_match_history`, writing to long-term memory, drafting a recommendation, sending a message to the drive team, retrying a failed tool call). \\
2. Sort each action into exactly one of three buckets: **no approval needed**, **approval required**, **never allowed at all**. \\
3. For every action you put in **approval required**, write one sentence justifying why it belongs there and not in "no approval needed": what specifically could go wrong if it ran unsupervised, tying back to a specific failure mode from `08-guardrails-failure-modes-and-eval.md` if you can. \\
4. Design the actual approval gate for the highest-stakes action on your list (most teams will land on "message the drive team"): write the exact text the agent should show a human before proceeding, following the format in the example above (what it's about to do, what data backs it up, and an explicit approve/edit/cancel choice). \\

Where you draw these lines is a judgment call, not a single right answer, but you should be able to defend your choices! 

## Resources

- [LLM06:2025 Excessive Agency](https://github.com/OWASP/www-project-top-10-for-large-language-model-applications/blob/main/2_0_vulns/LLM06_ExcessiveAgency.md) - OWASP's treatment of this module's exact concern: excessive functionality, permissions, and autonomy, and why human approval belongs at high-impact actions (docs)
