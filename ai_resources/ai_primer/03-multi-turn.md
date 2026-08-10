# Multi-Turn Conversation: Asking More than One Question

## What is Multi-Turn?

A turn in an LLM conversation refers to a single sequence of an input (your prompt) followed by an output (the model response). A multi-turn conversation is more than one of these sequences.

## Why does this difference matter?

In a single turn conversation, the only context the LLM is handling is your original prompt, and its original output. However, if you ask follow-up questions, its context now includes those questions and corresponding outputs. We already mentioned the Lost in the Middle problem, and on top of that, LLMs also tend to lose **consistency** over longer conversations, subtly contradicting or forgetting commitments they made in earlier turns. 

However, strong prompting can help mitigate this problem and allow you to get more out of the longer conversations.

Keep in mind that all of this also compounds the token-conservation problem from our context discussion: every turn resends the entire conversation so far, so a long multi-turn conversation burns through your context window faster than a single long prompt would. If a conversation is dragging on and the model keeps losing the thread, it's often better to summarize the current state (the rules, the current code, what's left to fix) and start a fresh conversation than to keep pushing more turns onto an already-long one.

## Prompting for Multi-Turn

To illustrate how multi-turn can work, let us run through an example. In this example, we are trying to build out a function that detects if a password is valid based on a set of rules.

### Turn 1: Initial Prompt
Here, we can start pretty broad in terms of our ask:

```text
I need a Python 3.11 function that checks whether a password is valid.

Rules:
- At least 8 characters
- Contains at least one number
- Contains at least one uppercase letter

Write a simple solution.
```

The model will almost certainly output a function that handles most passwords correctly, if not all of them. However, we want to treat this as a first draft rather than a finished answer, and use the next several turns to lock in consistency and catch edge cases.

### Turn 2: Consistency Lock-in Prompt
We want to make sure that the model is acknowledging the rules we set and putting those into the solution. We can prompt this as:

```text
Before changing anything, summarize the rules your function is enforcing in a numbered list.
```

This will help us ensure consistency in responses.

### Turn 3: Feedback
Suppose we notice that the function allows spaces as a valid character in a password, which we don't want. We can give it this prompt to fix that:

```text
Good. One issue: your function allows spaces, which I want to disallow.

Do NOT rewrite the full function yet.
Explain where the current logic fails and what needs to change conceptually.
```

Notice that in this step we want to see some reasoning first before we let the model run wild with rewriting some of the code.

This form of feedback is also known as **Human-in-the-Loop**.

### Turn 4: Targeted Modification
Now, we want to see the code change:

```text
Now update only the part of the function needed to enforce:
- No spaces allowed

Keep everything else exactly the same.
```

Here, we specify the exact change we want, and emphasize that we don't want to see any other code changed.

### Turn 5: Consistency Verification
We want to verify that our modification followed our rules, which we can check by doing this:

```text
Re-list all validation rules again.
Then confirm that the updated function enforces each one.
```

### Turn 6: Edge Cases
Assuming our consistency verification passes, we can move on to ensuring our code handles edge cases, or situations that are more rare but require special attention because they tend to be at the boundaries of what our code was meant to handle. We can stress test our code with a sample prompt like this:

```text
Now test the function with the following:

1. A normal valid password
2. A password that fails exactly one rule
3. A password that fails multiple rules
4. A true edge case that could easily be overlooked
   (for example: an empty string, a string of only spaces,
   or a string exactly 8 characters long)

For each case:
- State whether it should pass or fail
- Explain which rule(s) apply
```

The model's edge-case analysis is a good sanity check, but it isn't a substitute for running the tests yourself - paste the final function into your own environment and confirm the real output matches what the model claimed before you trust it. Once that checks out, we will have a robust function that solves our use case!

## Resources

- [Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/abs/2307.03172) - explains why long conversations lose consistency in the middle (paper)
- [What Is Human In The Loop (HITL)?](https://www.ibm.com/think/topics/human-in-the-loop) - IBM's explainer on the human-in-the-loop pattern used in Turn 3 (blog)
- [Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) - Anthropic's take on managing context across longer interactions, relevant to the "start fresh" advice above (blog)
- [OpenAI: Prompt Engineering](https://platform.openai.com/docs/guides/prompt-engineering) - covers testing changes systematically, a good habit for iterating across turns like we did here (instructional)
