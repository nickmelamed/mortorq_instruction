# 09 Observability

## Testing Before vs. Watching During

`08-guardrails-failure-modes-and-eval.md` was about building justified trust *before* the scouting agent runs unsupervised. Once the agent is actually running at a real competition, across real matches, it will eventually do something none of your tests anticipated.

**Observability** is the ability to see what an agent actually did, after the fact, in enough detail to reconstruct why it produced a given output. This is not done by re-running it and hoping to reproduce the bug, but by reading a record of the exact run that already happened.

## Logs: What Happened, One Step at a Time

The most basic unit of observability is a **log**: a structured, timestamped record of a single event. For an agent, the natural unit to log is one step of the ReAct loop from `05-planning-and-reasoning-patterns.md`; one Reason, one Act, one Observe. Recall the scratchpad idea from `03-context-engineering.md`: an agent's working notes as it goes. A log is what you get when you keep a durable copy of those notes outside the context window, instead of letting them disappear once the conversation ends.

A well-structured log entry captures more than just "what the final answer was":

```json
{
  "timestamp": "2026-07-11T14:32:01Z",
  "step": 3,
  "reasoning": "Team 4930 is weak on climb; checking top-ranked teams for climb rate.",
  "tool_call": "get_team_match_history(team_number=1114, event_code='2026casj')",
  "tool_result": "climb_rate: 0.90, auto_score: 4.2, rank: 3",
  "agent_id": "strategy-supervisor"
}
```

Compare this to just logging the final recommendation ("Recommend team 1114"); the final answer alone tells you *what* the agent decided, but nothing about *why*, or which specific piece of data it leaned on. If that recommendation turns out to be wrong, a log of only the final output leaves you re-running the whole task and guessing at what might have gone differently, while a step-by-step log lets you point at the exact reasoning line or tool result that caused it.

## Traces: Following One Task End to End

A **trace** stitches every log entry from a single task into one connected record, in order, including across agents. This matters most once you've built the supervisor/worker split from `07-multi-agent-systems.md`: without a trace connecting them, the supervisor's log shows it received "Team 1114: 90% climb rate, strong auto, ranked 3rd" from the worker, but not *how* the worker arrived at that summary. If the worker's own tool call returned a subtly wrong number, the supervisor's log alone won't show it; you need the worker's steps and the supervisor's steps linked into one trace, tagged with a shared task ID, so you can walk the entire path from the original question to the final answer, across every agent involved.

This is exactly the tool a real team would reach for after a bad recommendation: given a trace ID, pull every step, across every agent, that led to that one recommendation.

## Metrics: What's True in Aggregate

Logs and traces are about one specific run. **Metrics** are numbers aggregated across many runs, tracked over time, to catch problems that don't show up in any single trace:

- **Cost per task** and **latency per task** - is a typical question now taking twice as many tool calls (and twice the cost) as it did last month, even though nothing about the questions changed?
- **Tool failure rate** - is `get_team_match_history` erroring out more often this week? (Maybe a vendor's API changed and nobody noticed.)
- **Loop iteration counts** - recall the runaway-loop failure mode from `08`; the caps you set there are only useful if something is actually tracking how close to the cap real tasks are running, not just whether the cap technically exists.

A single trace answers "what happened on this one run." Metrics answer "is something drifting".

## What This Enables for Human-in-the-Loop

Observability isn't just for catching bugs, it's what makes an approval decision (covered next, in `10-human-in-the-loop-design.md`) something a person can actually reason about instead of rubber-stamping. A human asked to approve "message the drive team: recommend team 1114" can make a real judgment call if they can see the trace behind it (which data was fetched, what reasoning led here); without that trace, "approve or cancel" is just a coin flip dressed up as oversight.

## Try It

Below is a ReAct-style transcript (same style as `05-planning-and-reasoning-patterns.md`) that ends in a bad recommendation. Only the final two lines were shown to the drive team - everything else happened silently.

```text
Reason: Need team 4930's current stats before judging alliance fit.
Act:    get_team_match_history(team_number=4930, event_code="2026casj")
Observe: Team 4930 averages 3 pieces/match auto, doesn't climb, ranks 9th.

Reason: We're weak on climb - checking candidate teams' climb rate.
Act:    get_team_match_history(team_number=1114, event_code="2026casj")
Observe: Error - event code not found (typo: event was "2026caj", not "2026casj").

Reason: No data returned for 1114. Team 1114 likely has no notable climb record this
        event; moving on to next candidate.
Act:    get_team_match_history(team_number=2056, event_code="2026casj")
Observe: Team 2056 averages 2 pieces/match auto, climbs in 40% of matches, ranks 15th.

Reason: Of the candidates checked, 2056 is the strongest available option.
Agent to user: "Recommend team 2056 as your next alliance pick."
```

1. The recommendation is wrong: team 1114 (a strong climber, per `05-planning-and-reasoning-patterns.md`'s version of this same scenario) got silently dropped from consideration. Find the exact step where the real failure happened, and state it precisely: which line contains an error being misread as an absence of data? \\
2. Suppose only the final two lines (the recommendation and the message to the user) had been logged, as many first-draft agents do. Explain specifically why that logging level would make this bug nearly undiagnosable after the fact. What question could a person never answer from those two lines alone? \\
3. Design a structured log schema (a short field list, JSON-style like the example above) that would have made this bug immediately visible to a person reading the log; not just recoverable in theory, but visible without needing to re-run the task. Name the one field that does the most work in exposing this specific bug, and explain why. \\

## Resources

- [OpenTelemetry for Generative AI](https://opentelemetry.io/blog/2024/otel-generative-ai/) - the industry effort to standardize logs, traces, and metrics for LLM and agent systems, the real-world version of this module's schema (blog)
