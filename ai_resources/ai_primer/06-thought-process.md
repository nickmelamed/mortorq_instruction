# General Thought Process when Using AI

Everything so far has been about getting good outputs. Recall from `05-structured-and-validated-outputs.md`: checking that a structured output actually matches the schema and types you asked for. This file broadens that same instinct - verify, don't trust - to AI output in general, not just structured formats.

## Checking your Work
If you are using ChatGPT, for instance, you have a history of your chats and therefore the prompts you used and the outputs it produced. It is good practice to keep track of these, as they can be a big help in figuring out why code breaks.

## Disclosure and Academic Integrity
Cite that you used an LLM if you are publishing any work. This includes FIRST competition submissions. FIRST has specific rules about disclosing AI-assisted or AI-generated content (for example, in Engineering Notebooks or Award submissions like Chairman's/Impact Award), and these rules can change season to season, so check the current game manual for exact requirements.

## Verify, Don't Trust
No matter how confident or polished an AI's code looks, run it yourself and check the actual output against what you expected, rather than trusting it because it reads correctly. Reading code and running code catch different kinds of bugs. An LLM's own explanation of what its code does can be wrong even when stated with total confidence.

This matters even more for anything you can't verify just by running the code. Remember hallucinations and training cutoffs from our AI primer: if the model cites a specific API, method, or statistic, check it against the actual docs before you build on top of it.

## Debugging Checklist
If something is broken, some good things to have the model do are:
- Reproduce the issue conceptually
- Trace variable values step by step
- Add print statements to view intermediate outputs
- Suggest unit tests
- Write minimal failing examples

All of these can help structure your debugging process.

## When Not to Reach for AI at All
Everything above assumes you've already decided to use AI for the task in front of you. That decision itself is worth making deliberately, not by default:

- **If you can write it faster than you can prompt for it** (a getter, a one-line fix, a change you already know exactly how to make), just write it. Prompting has its own overhead, like describing the change, reading the output, checking it matches, and for genuinely small changes that overhead can cost more time than it saves.
- **If the point of the task is for you to learn the underlying skill**, using AI to skip straight to an answer defeats the purpose, the same way copying a homework solution does. This applies directly to this curriculum's own exercises: working through `back_end_resources` or `general_programming_resources` by prompting for the answer instead of reasoning through it yourself trades away the exact skill those modules exist to build.
- **If you can't verify the output**, don't ship it. "Verify, Don't Trust" above assumes you're capable of checking what comes back: reading it, running it, or reasoning about whether it's correct. Code you don't understand well enough to verify is code you shouldn't be the one merging, AI-assisted or not, especially anything on a real robot's control path.
- **If you're mid-competition, under a ticking clock, with no reliable internet** (a real FRC pit constraint - see `frc_resources/06_hardware_debugging` SS3), a fixed debugging process you already know cold is faster and more reliable than context-switching to write a good prompt and wait on a model that may not even be reachable. AI is a tool for the six weeks before that moment, not a substitute for having a plan during it.

None of this means "avoid AI". It means treating "should I use it for this specific task" as a real question with a real answer, not a reflex.

## Rules of Thumb
- If AI output surprises you, ask why
- If code works but you don't understand it, pause, and then ask for explanation
- If AI gives you too much output, ask it to be more concise (see Output Control in 04-prompt-engineering.md)
- If AI gives you too little, add more context

These can help you recalibrate how you're approaching AI usage. Now that you have the concepts and the habits, 07-sample-prompt.md walks through a full example that puts all of it together. Happy programming!

## Resources

- [Expanding the FIRST Toolbox with Artificial Intelligence](https://community.firstinspires.org/expanding-the-first-toolbox-with-artificial-intelligence) - FIRST's own community post on how teams are expected to use and disclose AI (instructional)
- [How do I cite generative AI in MLA style?](https://style.mla.org/citing-generative-ai/) - official MLA guidance on citing AI tools (instructional)
- [How to cite ChatGPT](https://apastyle.apa.org/blog/how-to-cite-chatgpt) - official APA Style guidance on the same (instructional)
- [A Survey on Hallucination in Large Language Models](https://arxiv.org/abs/2311.05232) - background on why "verify, don't trust" matters (paper)