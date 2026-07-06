# Prompt Engineering: More Advanced Techniques to Get Better Prompts (and Better Answers)

## What is Prompt Engineering?

Prompt engineering is essentially what we've been doing up to this point; we have been optimizing the inputs we give our models for achieving the desired outputs.

In this file, we're going to explore some more advanced topics in prompt engineering that may help you solve more complex problems.

There are a **ton** of techniques for prompt engineering, so don't be afraid to look up some more ideas. These will give you a great place to start.

## Chain-of-Thought (CoT) Prompting

Chain-of-Thought (CoT) prompting refers to the process of getting an LLM to reveal its intermediate steps in reaching a decision, which will give you more insight into how an answer is generated and therefore can direct you towards how to improve that output.

Generally, this is achieved in two different ways: simple cue, and exemplars. Simple cue means providing instructions in the prompt like `Let's think step-by-step`. Exemplars are sample questions and answers that are meant to highlight the type of response that the LLM could be. A prompt that uses both could look like this:

```text
You are helping a beginner programmer.

Here is an example of how to reason about a problem:

Example:
Question:
Why does this code print 0? Show your reasoning.

x = 5
if x > 10:
    print(x)
else:
    print(0)

Reasoning:
1. The variable x is set to 5.
2. The condition checks whether x is greater than 10.
3. Since 5 is not greater than 10, the condition is false.
4. The else branch runs and prints 0.

Final Answer:
It prints 0 because x is not greater than 10, so the else block executes.

---

Now apply the same reasoning style to this problem:

Question:
Why does this function return None? Think step by step

def add(a, b):
    a + b
```

The `Show your reasoning` and `Think step by step` lines are examples of simple cues - one modeled inside the exemplar, one applied directly to the real question - and the sample question is a good exemplar.

Note that using no exemplars is called zero-shot prompting, using exactly one is one-shot prompting (which is what the example above does), and using multiple is few-shot prompting.

## Role and Persona Prompting

Most LLMs are trained broadly across many domains rather than any one specialty - they can generally generate code, for example, but don't automatically know the conventions, constraints, or context specific to robotics. This is where directing how the model should act can give you better outputs.

By giving the model a certain role/persona, you are implicitly telling the model assumptions about knowledge, level of detail needed, etc. This will give you much more appropriate outputs for your use case.

For example, if you are trying to have the LLM give you a more robotics-level response, you could try something like this:

```text
You are a senior robotics engineer specializing in teaching a high school robotics team software development. Explain this bug without using jargon:
```

This puts the LLM in more of a "teaching" role and will give you a more digestible explanation.

## Constraint-Based Prompting

Sometimes we want the model to avoid doing certain things. By explicitly mentioning the constraints it is operating under, you will ensure you get appropriate outputs. For example:

```text
I need you to build a Python 3.11 function that calculates the next number in a fibonacci sequence. Below are some rules:
- Do not use recursion
- Use only native Python
```

## Output Control

A lot of your output might need to be code that can be copy and pasted. You might also want a way to avoid having the LLM ramble on, since they do tend to prefer more verbose answers. You can force a structured output like so:

````text
Respond using this format:

Explanation:
- ...

Code (Python, under 15 lines):
```python
...
```
````

If you don't want any explanation at all, and just want something you can immediately paste into your editor, you can be even more direct:

```text
Reply with only the code, in a single Python code block. No explanation, no comments outside the code.
```

This same technique is how you'd ask for output in a machine-parseable format like JSON instead of code or prose - `05-structured-and-validated-outputs.md` covers that specifically, including what tends to go wrong and how to check the result before you trust it.

## Decomposition Prompting

Breaking down the problem into steps can give the model a framework of how to answer your question instead of spewing out a long, drawn-out answer. For instance:

```text
I need some code that counts the number of odd numbers in a sequence. Follow these steps:
1. Describe the algorithm in words
2. Write pseudocode
3. Write code in Python
```

## Combining Techniques

None of these techniques are mutually exclusive - the strongest prompts usually stack several of them at once (a role, a few constraints, a decomposition step, maybe an exemplar). `07-sample-prompt.md` walks through a full example that does exactly this, so keep an eye out for how many of these techniques show up together in a single prompt.

## Resources

- [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903) - the original paper that introduced CoT prompting (paper)
- [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165) - the GPT-3 paper that popularized zero/one/few-shot prompting (paper)
- [Prompt Engineering Overview](https://docs.anthropic.com/en/docs/prompt-engineering) - covers role prompting, constraints, and output formatting in more depth (instructional)
- [Prompt Engineering Guide: Techniques](https://www.promptingguide.ai/techniques) - a reference covering CoT, few-shot, and more with worked examples (instructional)
- [dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide) - papers, notebooks, and further reading for every technique in this file (extra reading)

