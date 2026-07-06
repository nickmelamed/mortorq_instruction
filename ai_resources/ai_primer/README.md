# AI Resource Page

The `ai_primer` folder has some explanatory material to better understand how to leverage ChatGPT and similar models to aid your programming.

## What is AI?

Artificial Intelligence (AI) has several different definitions, but a generally easier way to think about it is that it is putting human-level decision-making into computers.

## What kind of AI is ChatGPT?

ChatGPT, and similar models like Claude or Gemini, fall under the category of Generative AI (GenAI), because they create **original** content instead of simply recalling existing information. These are all examples of Large Language Models (LLMs) because it is trained on a large amount of human text/video/audio to learn how to do tasks.

## Why should I care?

If you're reading this, good chance you have had some exposure to using ChatGPT or a similar LLM. This guide is not meant to be an exhaustive explanation on LLMs/GenAI (you can save that for your Masters/PhD), but rather an intro on how to utilize these tools to better your programming abilities.

If you ask any working professional in the tech world, there is a good chance that using GenAI in their everyday work is **mandatory** to be more productive. Learning how to use these tools will be crucial in allowing you to succeed in your professional pursuits.

## What's in this Primer?

Read these in order:

1. [00 - AI for Programming](00-ai-for-programming.md) - what AI is (and isn't) good for
2. [01 - Context is Key](01-context-is-key.md) - why context matters, plus its limits (tokens, context windows, privacy)
3. [02 - Common Prompts](02-common-prompts.md) - reusable prompt patterns for everyday coding
4. [03 - Multi-Turn](03-multi-turn.md) - carrying a conversation across multiple turns
5. [04 - Prompt Engineering](04-prompt-engineering.md) - more advanced techniques (Chain-of-Thought, personas, constraints)
6. [05 - Structured and Validated Outputs](05-structured-and-validated-outputs.md) - getting machine-parseable output (JSON) and checking it before you trust it
7. [06 - Thought Process](06-thought-process.md) - how to verify and reason about AI output
8. [07 - Sample Prompt](07-sample-prompt.md) - a full case study putting it all together

## Exercises

Reading about prompting only gets you so far - the `exercises` folder has a hands-on task paired with each file above. Each one asks you to actually run prompts against a real model (ChatGPT, Claude, Gemini, whichever you have) and check the result against a self-check checklist, rather than just reading along. Start with `exercise-0-spot-the-bad-prompt.md` (a quick self-check quiz), then work through the rest in order alongside the numbered files, finishing with `exercise-6-capstone.md`, which has you run the full 8-turn process from `07-sample-prompt.md` yourself on a new problem.
