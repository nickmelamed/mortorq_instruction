# Agent Resource Page 

The `agent_primer` folder picks up where `ai_primer` left off. That unit covered prompting a chatbot turn by turn: explaining code, generating tests, carrying a conversation across turns, all in response to something you typed. This folder covers a different kind of system - one that acts on its own initiative, across multiple steps, using tools, without you supplying a fresh prompt at every step.

## What are Agents? 

Agents are systems that autonomously perform tasks, meaning they do not need to respond to a live prompt, for instance, to perform said task. What distinguishes them from other pieces of software is that we hope that our agents can go beyond following rules, and learn to reason through tasks using other tools. 

## What kind of Agent is Codex/Claude Code/Cursor? 

Codex, Claude Code, Cursor, etc. fall under the category of coding agents. Their goal is to help you complete programming tasks. These tools are very powerful in that they go beyond simple autocomplete: they are able to write, debug, and test code, completing these tasks in parallel for peak efficiency. `11-agentic-coding-tools.md` covers these in depth.

## Why should I care? 

If you ask any working professional in the tech world, there is a good chance that using coding agents will be **mandatory** to be more productive. Learning how to use agents will increase your productivity, and ideally help you learn simultaneously so you become a more well-rounded engineer. 

## Key Terms

A running glossary of vocabulary introduced across this primer, in the order you'll meet it. Foundational LLM vocabulary (token, context window, hallucination, training cutoff, stateless, Lost in the Middle) is already covered in `ai_primer` and isn't repeated here.

- **Agent**: a system that performs tasks autonomously, without needing a fresh prompt at every step, and that reasons through multi-step tasks rather than just responding to one.
- **Working Memory**: an agent's current context window - everything it can "see" right now, including the task, recent tool results, and its own scratchpad notes; fast to use but gone once the conversation ends or compresses.
- **Compression**: shrinking older context to make room for new content, by deleting it outright or summarizing it, once a conversation exceeds the context window.
- **Context Collapse**: when compression causes the model to lose key details it actually needed.
- **Retrieval-Augmented Generation (RAG)**: retrieving relevant stored information and inserting it into context as part of generating a response, used when the needed information can't fit in the context window on its own.
- **Context Engineering**: deliberately designing every input an agent's context window holds - tool definitions, retrieved data, instructions, examples, scratchpad notes - not just the prompt.
- **System Instructions**: standing rules about how an agent should behave (role, constraints, tone), placed early in context so they act like standing law rather than getting lost.
- **Scratchpad**: a designated space (in context, or a file for coding agents) where an agent records its own intermediate reasoning and decisions as it works, instead of re-deriving them from the raw conversation history.
- **Context Isolation**: giving a sub-agent its own separate, narrow context instead of having every agent share one giant context window.
- **Right-Altitude Problem**: the tension between instructions that are too rigid (break on anything unanticipated) and too vague (produce unpredictable improvisation) - good instructions constrain the important decisions without over-scripting every case.
- **Tool** / **Function**: a real piece of code an agent is allowed to call, described to the model as a schema (name, description, parameters) rather than by its actual implementation.
- **Model Context Protocol (MCP)**: an open standard that lets a tool provider expose its tools once and have any MCP-compatible agent discover and call them, instead of every agent hand-authoring the same schema.
- **Tool Result**: the output returned by a tool call, inserted back into the agent's context for it to reason over.
- **ReAct (Reason, Act, Observe)**: a planning pattern where an agent reasons in text, takes one action, observes the result, and loops - deciding one step at a time rather than committing to a full plan up front.
- **Plan-and-Execute**: a planning pattern where an agent writes a full multi-step plan before taking any action, then executes it, only reconsidering the plan if something along the way contradicts it.
- **Self-Critique** / **Reflection**: an agent reviewing its own draft output against the original task before returning it, catching gaps its first pass missed - though only the gaps it thinks to check for.
- **Long-Term Memory**: information deliberately saved outside the context window so it can be retrieved in a later, possibly entirely separate, conversation.
- **Episodic Memory**: a long-term memory of one specific past event, tied to a particular time and place (e.g., one match's result).
- **Semantic Memory**: a long-term memory of a general fact distilled from many past events, not tied to any single instance (e.g., a season-long trend).
- **Supervisor / Worker**: a multi-agent architecture where a supervisor agent owns the overall goal and delegates narrow, well-scoped jobs to worker agents, each with its own clean context.
- **Prompt Injection**: instructions smuggled into content an agent retrieves or reads (a webpage, a document), rather than instructions its operator actually gave it.
- **Jailbreaking**: a real, authorized user directly asking an agent, mid-conversation, to bypass a rule it's supposed to follow - distinct from prompt injection because the request comes from a legitimate participant, not smuggled-in content.
- **Evaluation (Eval)**: deliberately testing an agent against known failure modes - malformed input, ambiguous questions, injected instructions, hard limits - before trusting it with anything that matters.
- **Observability**: the ability to see what an agent actually did, after the fact, in enough detail to reconstruct why it produced a given output.
- **Log**: a structured, timestamped record of a single event - for an agent, typically one Reason/Act/Observe step.
- **Trace**: every log entry from one task stitched together in order, including across multiple agents, so you can walk the entire path from question to final answer.
- **Metrics**: numbers aggregated across many runs (cost, latency, failure rate) that surface problems no single trace would show.
- **Approval Gate**: a designed stopping point where an agent presents what it's about to do and waits for explicit human confirmation before proceeding.
- **Permission Scoping**: deciding in advance exactly what an agent is and isn't allowed to do without asking, with real, named boundaries rather than "use good judgment."
- **Sandboxing**: running an agent's actions in an environment where a mistake can't reach anything that actually matters, regardless of what permission scoping allows.
- **Project Rules File**: a file (`CLAUDE.md`, `.cursor/rules`, `AGENTS.md`) checked into a repo and loaded into an agentic coding tool's context automatically every session, so conventions don't need re-explaining every prompt.
- **Handoff File**: a short, task-specific document capturing where a piece of unfinished work stands, so a brand-new session with an empty context window can pick it back up.
- **Plan Mode**: an agentic coding tool proposing a plan or diff without writing to disk, until a human explicitly approves it - an approval gate applied to code edits.
- **Subagents**: separate agent instances an agentic coding tool can spin up for narrow sub-tasks (a broad search vs. careful judgment), each with its own clean context.

## Where this fits relative to the rest of the curriculum

This is more advanced material, and it's a different skill from *using* AI tools well, which `ai_primer` already covers on its own. It's worth working through once the fundamentals elsewhere in this curriculum (`general_programming_resources`, `back_end_resources`, and whichever of `front_end_resources`/`ml_resources` you're focused on) are solid, not as a substitute for them or a detour before them. `11-agentic-coding-tools.md` is the one module worth pulling forward earlier than the rest, since it covers day-to-day practices (reviewing an agent's diffs, CLAUDE.md-style rules files) you'll actually use while working through everything else in this repo.

## What's in this Primer?

Read these in order:

0. [README](README.md) - this page: what agents are, and how they differ from the chatbots covered in `ai_primer`
1. [01 - Agent Basics](01-agent-basics.md) - the agent workflow vs. the chatbot workflow
2. [02 - Tokens and Context](02-tokens-and-context.md) - how agents use context windows, memory, and retrieval
3. [03 - Context Engineering](03-context-engineering.md) - designing every input an agent sees: tools, retrieved data, instructions, scratchpads, sub-agents
4. [04 - Tool Use and Function Calling](04-tool-use-and-function-calling.md) - giving an agent a real tool it can call
5. [05 - Planning and Reasoning Patterns](05-planning-and-reasoning-patterns.md) - ReAct, plan-and-execute, and self-critique loops
6. [06 - Memory Systems](06-memory-systems.md) - short-term vs. long-term memory, and what's worth remembering
7. [07 - Multi-Agent Systems and Orchestration](07-multi-agent-systems.md) - supervisor/worker patterns and why one agent isn't always enough
8. [08 - Guardrails, Failure Modes, and Evaluation](08-guardrails-failure-modes-and-eval.md) - runaway loops, prompt injection, hallucinated tool calls, and testing an agent before trusting it
9. [09 - Observability](09-observability.md) - logs, traces, and metrics: watching what an agent actually did, after the fact
10. [10 - Human-in-the-Loop Design](10-human-in-the-loop-design.md) - approval gates, permission scoping, and sandboxing
11. [11 - Agentic Coding Tools](11-agentic-coding-tools.md) - Claude Code, Cursor, and how to review what they do instead of trusting them blindly
12. [12 - Capstone Build](12-capstone-build.md) - assembling everything into one finished agent and presenting it

Starting with module 04, every file builds one running project: a scouting/strategy agent for FRC matches, adding one new capability per module until it's a finished system in `12-capstone-build.md`.

**Optional extension, once you have a trained model:**

13. [13 - Integrating a Trained Model](13-integrating-a-trained-model.md) - wiring a real value/policy network from `ml_resources/rl_primer` into the agent as a tool. Not part of the core twelve-module arc or the capstone rubric above - a follow-on for once that model actually exists.

## Try It

Before reading any further, open any chatbot you have access to (ChatGPT, Claude, Gemini) and give it a goal, not a question - something that requires more than one real-world step to actually finish, like:

```text
Find our FRC team's average OPR (Offensive Power Rating) over our last 5 competitions
this season, and email a one-paragraph summary of the trend to our mentor.
```

It cannot actually do this. Watch closely for *how* it fails - it won't just say "I can't." It will likely do one of the following:
- Refuse or explain that it doesn't have live access to competition data or your email
- Ask you to paste in the data and the mentor's email address, handing the parts it can't do back to you
- Confidently make up plausible-looking numbers and a summary anyway (a hallucination - see `ai_primer/00-ai-for-programming.md`)

Note which of these three happened, and specifically which part of the task it couldn't cross on its own: getting real data, or taking a real action in the world. That gap - between answering a question and completing a goal - is exactly what turns a chatbot into an agent, and it's what the rest of this folder is about.
