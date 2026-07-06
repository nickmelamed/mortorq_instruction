# 07 Multi-Agent Systems and Orchestration

## One Agent Doing Too Much

The scouting agent so far is a single agent doing everything in a single context window. That works for one alliance-pick question. It starts to strain once the agent's job grows to handle jobs that require different contexts. The fetching job wants to churn through many tool calls without much reasoning depth. The strategy job wants a small amount of clean, well-organized data and a lot of careful reasoning over it. Cramming both into one context, as covered in `03-context-engineering.md`, means the reasoning job is constantly competing for attention with a growing pile of raw tool-call noise.

## Supervisor and Worker Patterns

The common fix is to split one overloaded agent into several smaller ones, each with a narrow job and its own clean context - the **context isolation** idea introduced in `03-context-engineering.md`, now as a full architecture.

The most common shape is **supervisor/worker**: a **supervisor** agent owns the overall goal and decides what needs to happen, but delegates the actual legwork to one or more **worker** agents, each with a narrow, well-defined job and only the context needed to do it.

For the scouting agent, that split looks like:

- **Data-fetching worker**: given a team number and event code, calls the tools from `04-tool-use-and-function-calling.md`, gathers raw match history, and returns a clean, structured summary - nothing else. It doesn't need to know the strategy goal is "recommend 3 alliance picks"; it just needs to know what data to fetch.
- **Strategy-reasoning supervisor**: owns the actual goal ("recommend our next 3 alliance picks"), decides which teams need data, hands each one to the data-fetching worker, and reasons over the returned summaries to produce a final recommendation.

```text
Supervisor: I need data on teams 1114, 2056, and 254 before I can compare them.
Supervisor -> Worker: "Fetch match history and climb rate for team 1114, event 2026casj."
Worker: (calls get_team_match_history, reasons only about that one team's data)
Worker -> Supervisor: "Team 1114: 90% climb rate, strong auto, ranked 3rd."
Supervisor -> Worker: "Fetch match history and climb rate for team 2056, event 2026casj."
... (repeats for each team) ...
Supervisor: Now comparing all three summaries against our own weaknesses to rank picks.
```

Notice the worker's context never grows past "one team's raw data": it does its job and hands back a short, distilled result, exactly the pattern described for sub-agents in `03-context-engineering.md`. The supervisor's context grows by one clean summary per team. 

## Why Split at All

Splitting into multiple agents costs something real: more coordination overhead, more places for a handoff to go wrong, and often more total tokens spent (each worker needs its own instructions loaded into its own context). It's worth that cost when a single agent's context is genuinely fighting itself, due to instructions confusion, for example. 

It is *not* automatically worth it just because a task has multiple steps - `05-planning-and-reasoning-patterns.md`'s ReAct loop already handles multi-step tasks fine within a single agent. Reach for multiple agents when the steps have genuinely different *character* (bulk data-gathering vs. careful judgment, or two workers that would otherwise trip over each other's context), not just because there's more than one step.

## Try It

You'll build both versions of the same task and compare them directly.

1. Write a single, overloaded prompt for a chatbot that asks it to do the scouting agent's full job in one shot: *"You are a scouting agent. Fetch and reason about data for teams 1114, 2056, 254, and 4930 at event 2026casj [invent plausible stats for each team yourself since you don't have real tool access], then recommend our top 3 alliance picks, explaining your reasoning for each."* Run this 3 separate times (fresh conversations) and note whether the reasoning stays consistent across all 3 runs - same top 3, same justification - or drifts.
2. Now split it into two prompts simulating a supervisor/worker split. First, for each team separately, prompt: *"You are a data-fetching agent. Given team [X] at event 2026casj, invent plausible match stats and return only a short structured summary: climb rate, auto score, and rank. No recommendation, no comparison to other teams."* Collect all 4 summaries.
3. Then prompt a fresh conversation: *"You are a strategy agent. Here are 4 team summaries: [paste the 4 summaries from step 2]. Recommend our top 3 alliance picks with reasoning."* Run this final step 3 separate times and check consistency the same way as step 1.
4. Compare: was the split version's final recommendation more consistent across its 3 runs than the single-agent version's? Write two or three sentences on whether the split was worth the extra steps for this specific task, or whether the single-agent version was good enough.
