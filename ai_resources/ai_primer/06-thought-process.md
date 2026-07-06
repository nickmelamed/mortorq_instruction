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