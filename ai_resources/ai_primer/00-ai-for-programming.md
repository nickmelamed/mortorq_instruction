# AI for Programming:

A quick scoping note: this primer focuses on conversational AI tools you interact with turn by turn (ChatGPT, Claude, Gemini, etc.). IDE-integrated autocomplete (like GitHub Copilot) and autonomous coding agents (like Claude Code, Cursor) build on these same ideas but behave differently, since they act directly on your codebase. See the `agent_primer` folder for a deeper dive on those topics. We also dive more into the architecture and history of GenAI in `ml_genai_architecture_primer`, so this unit will focus more on using these tools rather than what's under the hood. 

## What AI is for Programming

AI is very good at the following tasks:
- Explaining unfamiliar concepts
- Generating starter code and some examples
- Debugging by reasoning through errors
- Refactoring code (rewriting it)
- Suggesting test cases
- Acting as another set of eyes

Note the above is not an exhaustive list, but the point is to establish that AI cannot do *everything*.

You can think of AI as an inexperienced but motivated teammate; it can give you a **ton** of volume, but it requires direction to succeed.

## What AI is not for Programming

AI struggles with the following:
- Knowing your project context (unless you provide it...)
- 100% correctness (it **will** be wrong sometimes)
- Fully replacing your understanding of your code
- Staying current on brand-new APIs, libraries, or best practices (its knowledge has a training cutoff)
- Guaranteeing secure code (it can produce issues like hardcoded secrets or missing input validation unless you explicitly ask it to consider that)

To summarize, you cannot expect AI to read your mind and be able to figure out your project, **unless** you tell it precisely what you want it to do.

More importantly, even **if** you give it all the proper context, it **will** make mistakes. This is because GenAI models are designed to be **probabilistic**: if you give it the same input, it will not always return the same output. Contrast this with a **deterministic** model, which always returns the same outputs for every input (like $y = mx + b).

 If you don't believe me, open up Claude, ChatGPT, or your favorite chatbot, and ask it "Should I join my high school's robotics team?", a few different times. Even if it returns "yes" in each response, the exact responses will not be the same.
 
This means there is some randomness inherent in their outputs. The randomness is great for giving you creative answers, but inevitably leads to wrong answers too!

This is also why models sometimes **hallucinate**, which is when they state something false with total confidence, as if it were fact. It isn't lying on purpose; it's generating text that sounds plausible based on patterns in its training data, whether or not that text is actually true. Always double-check anything surprising or oddly specific (a library function, a statistic, an API) before you trust it.

Related to hallucination is the **training cutoff**: every model's knowledge stops at some point in time, so it can confidently suggest a deprecated API, an old library version, or miss a recent breaking change entirely. This matters a lot in a fast-moving framework like WPILib, so always sanity-check version-specific details rather than assuming the model is current. 

It is important to note that *agentic* models are likely able to overcome this problem. If you ask Claude Code to build according to the most recent Phoenix Tuner documentation, it will be able to look up that documentation and reference it. However, traditional chatbots, like older versions of ChatGPT, didn't have this capability.

And finally, don't let using GenAI models become a replacement for your learning. You will need to understand the code you are running in order to use the model better!

## Resources

- [A Survey on Hallucination in Large Language Models: Principles, Taxonomy, Challenges, and Open Questions](https://arxiv.org/abs/2311.05232) - a research survey on why and how LLMs hallucinate (paper)
- [Security Weaknesses of Copilot-Generated Code in GitHub Projects: An Empirical Study](https://arxiv.org/abs/2310.02059) - an empirical study quantifying how often AI-generated code contains real security flaws (paper)
- [CCS Researchers Find GitHub Copilot Generates Vulnerable Code 40% of the Time](https://cyber.nyu.edu/2021/10/15/ccs-researchers-find-github-copilot-generates-vulnerable-code-40-of-the-time/) - NYU's plain-language write-up of that original finding (blog)
- [Prompt Engineering Overview](https://docs.anthropic.com/en/docs/prompt-engineering) - Anthropic's own docs on getting good output from a model, a preview of what the rest of this primer covers (instructional)