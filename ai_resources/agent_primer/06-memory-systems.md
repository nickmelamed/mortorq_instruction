# 06 Memory Systems

## Beyond One Match

Recall from `02-tokens-and-context.md`: agents store previous context in external storage and pull it back in via retrieval-augmented generation (RAG), because their context window can't hold everything.

That file introduced the idea at the level of a single conversation running long. This module goes deeper: what happens when the agent needs to recall things not from earlier in *this* conversation, but from a whole season of matches, weeks apart, across dozens of separate sessions?

That's exactly the scouting agent's next requirement. Recommending alliance picks in `05-planning-and-reasoning-patterns.md` only needed the current event's data. A better version of the agent should also know: how did this team perform at the *last* competition, not just this one? Did their climb reliability improve over the season? That requires memory that survives past a single conversation.

## Working Memory vs. Long-Term Memory

**Working memory** (also called **short-term memory**) is just the current context window. It is everything the agent can "see" right now, including the current task, recent tool results, and its own scratchpad notes from `03-context-engineering.md`. It's fast to use (no retrieval step needed, it's just already there) but it disappears the moment the conversation ends or gets compressed out.

**Long-term memory** is information deliberately saved *outside* the context window, in external storage, so it can be pulled back in later, potentially in a completely different conversation, days or weeks later. Long-term memory typically splits into two kinds:

- **Episodic memory** - records of specific past events: "At the 2026 CASJ regional, team 4930 climbed in 8 of 10 matches." This is a memory of something that happened, tied to a specific time and place.
- **Semantic memory** - general facts distilled from many events, without necessarily being tied to one specific instance: "Team 4930's climb reliability is trending upward this season." This is a conclusion built up from many episodic memories, not any single match.

A scouting agent needs both. Episodic memory answers "what happened when we played them at Regional X", which is useful for a rematch. Semantic memory answers "is this team getting better or worse", which is useful for judging a team the agent hasn't directly scouted recently.

## What Gets Written to Long-Term Memory (and What Doesn't)

Not everything that happens in working memory deserves to be saved permanently, and treating it as if it should causes its own problems. A memory store that is filled with irrelevant information becomes as hard to search through as a context window dealing with the Lost in the Middle Effect.

A reasonable rule: write to long-term memory when information will plausibly matter again later and won't be reproducible after the source is gone. A match result, once the match is over, cannot be re-observed, so it should be saved. A tool-call retry (the agent's second attempt after a timeout) is just internal noise from getting to that result, so it doesn't need to be saved once the final result is. Scratch reasoning the agent used mid-task ("let me check team 1114 first, then 2056") is useful *during* that task and forgettable once the task is done; the conclusions it reached are what's worth keeping, not the meandering path to them.

This mirrors a decision your team already makes with real scouting data: you keep the match-by-match spreadsheet (episodic), but you don't keep every scout's scratch notes about which pen they used to write it (working detail, safe to discard).

## Retrieval Quality Over a Season

A season of scouting data is large enough that the agent can't just dump all of it into context. It has to *retrieve* the relevant slice via RAG, the same way described in `02-tokens-and-context.md`. Over a whole season, retrieval quality matters more than it did for a single conversation, because the more data accumulated, the easier it is for the wrong information to be retrieved! 

Concretely: if the agent is asked "how does team 4930 climb this season?" and the retrieval step only pulls back their earliest matches (because those happen to match the search terms best), the agent might report a climb rate from week 1 as if it reflects week 8, which is not a hallucination in the sense of inventing facts, but a correctness failure caused by retrieving the right *kind* of memory from the wrong *slice* of time. Well-designed memory retrieval for a season of data needs to account for recency, not just topical relevance.

## Build It

Design a memory schema for the scouting agent: a concrete list of fields it would store per team, per match, to support recall across an entire season. You have a strict constraint: **no more than 8 fields total.**

Requirements your schema must satisfy:
- It must support answering an episodic question ("how did team 4930 do specifically at the week 3 regional?")
- It must support answering a semantic question ("is team 4930's climb rate trending up or down this season?") without storing a separately-computed trend field (the trend should be derivable from the raw fields you chose)
- Every field must be one you can justify keeping under the "write to long-term memory" rule above; if you can't explain why a field needs to survive past a single conversation, cut it

Write your 8 (or fewer) fields as a short list, each with its type and a one-sentence justification, e.g.:

```text
1. team_number (int) - identifies which team the record belongs to; needed for every query
2. event_code (string) - distinguishes which competition this record is from, for episodic recall
...
```

Once you have your list, test it against a question it *doesn't* obviously handle: "which of our scouted teams most improved their climb rate between their first and last event this season?" If your schema can't answer that without adding a 9th field, revise which 8 you kept rather than going over the limit.

## Resources

- [A Survey on the Memory Mechanism of Large Language Model based Agents](https://arxiv.org/abs/2404.13501) - a broader academic treatment of the working/long-term and episodic/semantic memory split this module covers (paper)
