# AI Resource Page

The `ai_primer` folder has some explanatory material to better understand how to leverage ChatGPT and similar models to aid your programming.

## What is AI?

Artificial Intelligence (AI) has several different definitions, but a generally easier way to think about it is that it is putting human-level decision-making into computers.

## What kind of AI is ChatGPT?

ChatGPT, and similar models like Claude or Gemini, fall under the category of Generative AI (GenAI), because they create **original** content instead of simply recalling existing information. These are all examples of Large Language Models (LLMs) because it is trained on a large amount of human text/video/audio to learn how to do tasks.

## Why should I care?

If you're reading this, good chance you have had some exposure to using ChatGPT or a similar LLM. This guide is not meant to be an exhaustive explanation on LLMs/GenAI (you can save that for your Masters/PhD), but rather an intro on how to utilize these tools to better your programming abilities.

If you ask any working professional in the tech world, there is a good chance that using GenAI in their everyday work is **mandatory** to be more productive. Learning how to use these tools will be crucial in allowing you to succeed in your professional pursuits.

## Key Terms

A running glossary of vocabulary introduced across this primer, in the order you'll meet it.

- **Hallucination**: a model stating something false with total confidence, generated because it sounds plausible given patterns in its training data, not because it's lying on purpose.
- **Training Cutoff**: the point in time after which a model has no knowledge, so it can confidently suggest a deprecated API, an old library version, or miss a recent breaking change entirely.
- **Prompt**: the input you give a model - text, an image, or a combination - asking a question or giving an instruction.
- **Token**: the unit of text a model actually processes, and what you're limited and billed by; a rough rule of thumb is 100 tokens ≈ 75 words.
- **Context Window**: the maximum number of tokens a model can hold in a single conversation at once, prompt and response combined.
- **Stateless**: a model has no memory of past conversations by default; within one conversation, it only "remembers" what's still inside the current context window.
- **Lost in the Middle Effect**: the tendency for a model to pay less attention to information in the middle of a long context than to what's at the beginning or end.
- **Turn** / **Multi-Turn**: one prompt-and-response exchange; a multi-turn conversation is more than one of these, carrying shared context forward across all of them.
- **Human-in-the-Loop (HITL)**: asking a model to explain its reasoning or intended change before it rewrites anything, so you can catch a bad direction before it's baked into code.
- **Consistency Lock-in**: asking a model to restate the rules or requirements it's currently working from, to catch drift before you build further on top of its answer.
- **Chain-of-Thought (CoT) Prompting**: asking a model to show its intermediate reasoning steps rather than just a final answer.
- **Zero-Shot / One-Shot / Few-Shot Prompting**: giving a model zero, one, or multiple worked examples of the kind of answer you want, alongside your actual question.
- **Role / Persona Prompting**: telling a model to act as a specific role (e.g., "senior robotics engineer"), which implicitly sets its assumed audience and level of detail.
- **Constraint-Based Prompting**: explicitly stating what a model must not do (e.g., "no recursion," "standard library only") to keep its output within bounds you can actually use.
- **Decomposition Prompting**: breaking a request into explicit steps (describe, then pseudocode, then code) so the model reasons in stages instead of jumping straight to an answer.
- **Output Control**: specifying the exact shape of a response (a fixed set of sections, code-only, no prose) instead of leaving the format up to the model.
- **JSON (JavaScript Object Notation)**: a flat, labeled, machine-parseable text format built from key-value pairs - the most common shape requested for structured output.
- **Structured Output**: a response constrained to a specific, predictable shape (like JSON) instead of free-flowing prose, so a program can reliably pull fields out of it.
- **Validation**: checking a model's output against what you actually asked for - does it parse, are the keys and types right, are the values sane - before trusting or using it.
- **Schema Drift**: when a structured output's fields don't match what was requested (a key renamed, dropped, or an extra one added) while still looking superficially valid.

## What's in this Primer?

Read these in order:

1. [00 - AI for Programming](00-ai-for-programming.md) - what AI is (and isn't) good for
2. [01 - Context is Key](01-context-is-key.md) - why context matters, plus its limits (tokens, context windows, privacy)
3. [02 - Common Prompts](02-common-prompts.md) - reusable prompt patterns for everyday coding
4. [03 - Multi-Turn](03-multi-turn.md) - carrying a conversation across multiple turns
5. [04 - Prompt Engineering](04-prompt-engineering.md) - more advanced techniques (Chain-of-Thought, personas, constraints)
6. [05 - Structured and Validated Outputs](05-structured-and-validated-outputs.md) - getting machine-parseable output (JSON) and checking it before you trust it
7. [06 - Thought Process](06-thought-process.md) - how to verify and reason about AI output, and when not to reach for it at all
8. [07 - Sample Prompt](07-sample-prompt.md) - a full case study putting it all together

## Exercises

Reading about prompting only gets you so far - the `exercises` folder has a hands-on task paired with each file above. Each one asks you to actually run prompts against a real model (ChatGPT, Claude, Gemini, whichever you have) and check the result against a self-check checklist, rather than just reading along. Start with `exercise-0-spot-the-bad-prompt.md` (a quick self-check quiz), then work through the rest in order alongside the numbered files. `exercise-6-thought-process.md` is the odd one out - it isn't about running a prompt well, but deciding whether to prompt at all. Finish with `exercise-7-capstone.md`, which has you run the full 8-turn process from `07-sample-prompt.md` yourself on a new problem.
