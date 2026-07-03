# AI for Programming: What it is (and isn't)

A quick scoping note: this primer focuses on conversational AI tools you interact with turn by turn (ChatGPT, Claude, Gemini, etc.). IDE-integrated autocomplete (like GitHub Copilot) and autonomous coding agents (like Claude Code, Cursor) build on these same ideas but behave differently, since they act directly on your codebase. See the `agent_primer` folder for a deeper dive on those topics. 

## What AI is for Programming

AI is very good at the following tasks:
- Explaining unfamiliar concepts
- Generating starter code and some examples
- Debugging by reasoning through errors
- Refactoring code (rewriting it)
- Suggesting test cases
- Acting as another set of eyes

You can think of AI as an inexperienced but motivated teammate; it can give you a **ton** of volume, but it requires direction to succeed.

## What AI is not for Programming

AI struggles with the following:
- Knowing your project context (unless you provide it...)
- 100% correctness (it **will** be wrong sometimes)
- Fully replacing you understanding your code
- Guessing missing requirements
- Staying current on brand-new APIs, libraries, or best practices (its knowledge has a training cutoff)
- Guaranteeing secure code (it can produce issues like hardcoded secrets or missing input validation unless you explicitly ask it to consider that)

To summarize, you cannot expect AI to read your mind and be able to figure out your project, **unless** you tell it precisely what you want it to do.

More importantly, even **if** you give it all the proper context, it **will** make mistakes. This is because GenAI models are designed to be probabilistic, not deterministic, meaning there is some randomness inherent in their outputs. The randomness is great for giving you creative answers, but inevitably leads to wrong answers too!

This is also why models sometimes **hallucinate** - stating something false with total confidence, as if it were fact. It isn't lying on purpose; it's generating text that sounds plausible based on patterns in its training data, whether or not that text is actually true. Always double-check anything surprising or oddly specific (a library function, a statistic, an API) before you trust it.

Related to hallucination is the **training cutoff**: every model's knowledge stops at some point in time, so it can confidently suggest a deprecated API, an old library version, or miss a recent breaking change entirely. This matters a lot in a fast-moving framework like WPILib, so always sanity-check version-specific details rather than assuming the model is current.

And finally, don't let using GenAI models become a replacement for your learning - you will need to understand the code you are running in order to use the model better!