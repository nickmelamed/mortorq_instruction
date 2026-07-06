# 04 Tool Use and Function Calling

## The Scouting Agent

Starting here, every module in this folder builds one running project: an agent for scouting and strategy at FRC competitions (I think this might be kind of popular). This module gives it its first capability: the ability to actually look something up, instead of only being able to talk.

## What Is a Tool?

An LLM, on its own, can only generate text based on its training data (recall the training cutoff from `ai_primer/00-ai-for-programming.md`). It has no way to check today's match schedule, query a database, or do arithmetic it can't already reason through. A **tool** (also called a **function**) closes that gap: it's a piece of real code the agent is allowed to call, with the model deciding *when* and *with what arguments* to call it.

A tool is described to the model as a schema with three parts:

- **Name** - a short identifier the model uses to invoke it, e.g. `get_team_match_history`
- **Description** - plain-language text explaining what the tool does, when to use it, and any limits
- **Parameters** - the arguments the tool accepts, each with a name, a type, and usually its own description

Here's a real schema for the scouting agent's first tool:

```json
{
  "name": "get_team_match_history",
  "description": "Look up a specific FRC team's match results for the current competition event. Returns each match's score, alliance color, and whether the team's robot climbed. Only covers the event currently loaded - does not cover past seasons.",
  "parameters": {
    "team_number": {
      "type": "integer",
      "description": "The FRC team number, e.g. 4930"
    },
    "event_code": {
      "type": "string",
      "description": "The competition event code, e.g. '2026casj'"
    }
  }
}
```

This whole schema gets loaded into the model's context on every turn where the tool is available (recall from `03-context-engineering.md` that tool definitions occupy context just like any other input) - the model never sees the actual Python or JavaScript behind `get_team_match_history`, only this description of what it does.

## How the Model Decides to Call a Tool

When the model is given a task and a set of available tools, it isn't running a fixed script that says "always call this tool here." At each step, it's deciding, based on the task and the tool descriptions in context, whether calling a tool would help, and if so, which one, and with what arguments. This is why the description matters as much as the underlying code: the model's only knowledge of what a tool does *is* that description.

A typical single tool-call step looks like this:

1. The agent decides it needs data it doesn't already have (e.g., "I need team 4930's match history to answer this")
2. The agent emits a structured call: `get_team_match_history(team_number=4930, event_code="2026casj")`
3. The actual tool code runs (outside the model, in real infrastructure) and returns a result
4. The result is inserted back into the agent's context as a **tool result**
5. The agent reasons over that result and either calls another tool, or responds to the user

## When Tool Calls Fail

Tool calls fail more often than a first-time agent builder expects, and an agent has to be built to expect it:

- **Bad arguments** - the model calls `get_team_match_history(team_number="four thousand nine hundred thirty")` instead of an integer, and the tool call errors before it even runs
- **Tool-level failure** - the arguments are valid but the underlying system fails (the event code doesn't exist, the scouting database is down)
- **Silent wrong results** - the call "succeeds" but returns something misleading (an empty match list because the event hasn't started yet, which the agent could easily read as "this team has no data" rather than "this event hasn't happened")

A well-built agent treats a failed or empty tool result as its own case to reason about, not as license to fabricate an answer. An agent that calls `get_team_match_history` and gets an error should say so, not confidently invent a match history that sounds plausible - that's the same hallucination risk from `ai_primer/00-ai-for-programming.md`, except now it's dressed up as "real" retrieved data instead of an obvious guess, which makes it more dangerous, not less.

## Tool Descriptions Are a Design Surface

A vague tool description doesn't just risk misuse - it risks the tool being ignored entirely, because the model has no way to judge when it applies. Compare the description above to this one:

```json
{
  "name": "get_data",
  "description": "gets data",
  "parameters": {
    "x": { "type": "string", "description": "input" }
  }
}
```

Nothing here tells the model what data, from where, scoped to what, or what `x` should actually contain. Faced with a question like "how did team 4930 do in their last match?", a model given only this schema might not call the tool at all (it can't tell if it's relevant), might call it with the wrong argument (passing "4930" as a guess for `x` when `x` was actually meant to be an event code), or might just answer from its own (nonexistent) knowledge of team 4930's season. None of these are the tool's "fault" in the code - they're a direct result of the description failing to do its job.

## Try It

You'll test this directly instead of just reading about it.

1. Open a chat interface to a model that supports tool/function calling (or simulate it: paste the schema below into a regular chat model along with the instruction "You have access to this tool. When you need it, respond with the exact function call you'd make, in the form `tool_name(args)`, instead of answering directly.").
2. Give it this deliberately vague schema:

```json
{
  "name": "get_data",
  "description": "gets data",
  "parameters": {
    "x": { "type": "string", "description": "input" }
  }
}
```

3. Ask it: `"How did team 4930 do in their last two matches at event 2026casj?"`
4. Record what happens - does it call the tool at all? If so, with what value for `x`? If not, does it answer anyway (and where would that answer be coming from, since it has no real data source)?
5. Now rewrite the schema so it's unambiguous - give it a real name, a description covering what it returns and its scope/limits, and split `x` into properly named, typed parameters (you can reuse the `get_team_match_history` schema above as a model, but write your own).
6. Re-run the same question with your rewritten schema and record the new result.

Write two or three sentences comparing the two runs: what specifically changed in the model's behavior (did it call the tool correctly, ask a clarifying question, or still guess), and which part of your rewritten description do you think caused that change?
