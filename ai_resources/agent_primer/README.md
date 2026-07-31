# Agent Resource Page 

The `agent_primer` folder picks up where `ai_primer` left off. That unit covered prompting a chatbot turn by turn: explaining code, generating tests, carrying a conversation across turns, all in response to something you typed. This folder covers a different kind of system - one that acts on its own initiative, across multiple steps, using tools, without you supplying a fresh prompt at every step.

## What are Agents? 

Agents are systems that autonomously perform tasks, meaning they do not need to respond to a live prompt, for instance, to perform said task. What distinguishes them from other pieces of software is that we hope that our agents can go beyond following rules, and learn to reason through tasks using other tools. 

## What kind of Agent is Codex/Claude Code/Cursor? 

Codex, Claude Code, Cursor, etc. fall under the category of coding agents. Their goal is to help you complete programming tasks. These tools are very powerful in that they go beyond simple autcomplete: they are able to write, debug, and test code, completing these tasks in parallel for peak efficiency. `11-agentic-coding-tools.md` covers these in depth.

## Why should I care? 

If you ask any working professional in the tech world, there is a good chance that using coding agents will be **mandatory** to be more productive. Learning how to use agents will increase your productivity, and ideally help you learn simultaneously so you become a more well-rounded engineer. 

## What's in this Primer?

Read these in order:

0. [README](README.md) - this page: what agents are, and how they differ from the chatbots covered in `ai_primer`
1. [01 - Agent Basics](01-agent-basics.md) - the agent workflow vs. the chatbot workflow
2. [02 - Tokens and Context](02-tokens-and-context.md) - how agents use context windows, memory, and retrieval
3. [03 - Context Engineering](03-context-engineering.md) - designing every input an agent sees: tools, retrieved data, instructions, scratchpads, sub-agents
4. [04 - Tool Use and Function Calling](04-tool-use-and-function-calling.md) - giving an agent a real tool it can call
5. [05 - Planning and Reasoning Patterns](05-planning-and-reasoning-patterns.md) - ReAct, plan-and-execute, and self-critique loops
6. [06 - Memory Systems](06-memory-systems.md) - short-term vs. long-term memory, and what's worth remembering
7. [07 - Multi-Agent Systems](07-multi-agent-systems.md) - supervisor/worker patterns and why one agent isn't always enough
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
