# General Thought Process when Using AI

Everything so far has been about getting good outputs. This file is about the habits and instincts that help you use those outputs well once you have them.

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

## Rules of Thumb
- If AI output surprises you, ask why
- If code works but you don't understand it, pause, and then ask for explanation
- If AI gives you too much output, ask it to be more concise (see Output Control in 04-prompt-engineering.md)
- If AI gives you too little, add more context

These can help you recalibrate how you're approaching AI usage. Now that you have the concepts and the habits, 06-sample-prompt.md walks through a full example that puts all of it together. Happy programming!