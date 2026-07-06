# Exercise 0: Spot the Bad Prompt

## Goal
A quick self-check on `01-context-is-key.md` and `02-common-prompts.md` before you move on to the hands-on exercises. For each prompt below, decide whether it's likely to get a good result, and why, before revealing the answer.

## 1

```text
This is broken, fix it:

[paste of a 200-line file, no error message, no description of what's wrong]
```

<details>
<summary>Answer</summary>

Bad. No error message, no expected-vs-actual behavior, and far more code than is relevant. See `01-context-is-key.md` on what good context requires.
</details>

## 2

```text
Refactor this Python 3.11 function to be more Pythonic. Keep the behavior identical.

def add_all(nums):
    total = 0
    for i in range(len(nums)):
        total = total + nums[i]
    return total
```

<details>
<summary>Answer</summary>

Good. Names the language version, gives the actual code, and constrains the model to preserve behavior. See the Refactoring Prompt in `02-common-prompts.md`.
</details>

## 3

```text
Is this code secure? Just answer yes or no.
```

<details>
<summary>Answer</summary>

Bad, on two counts: no code was actually included, and forcing a yes/no answer on an inherently nuanced question (security) invites an overconfident, possibly hallucinated answer instead of a reasoned one. See `00-ai-for-programming.md` on hallucination and `06-thought-process.md` on verifying rather than trusting.
</details>

## 4

```text
You are a senior FRC mentor teaching a beginner. Explain this autonomous state machine bug step by step: first what the state machine is supposed to do, then where it diverges.

[code]
```

<details>
<summary>Answer</summary>

Good. Combines role prompting with decomposition, both covered in `04-prompt-engineering.md`.
</details>

## 5

```text
Write my entire autonomous routine, vision pipeline, and drivetrain code in one message.
```

<details>
<summary>Answer</summary>

Bad. Too much at once - see the Incremental Build Prompt in `02-common-prompts.md`. A request this broad will almost certainly produce shallow or subtly broken code in every piece.
</details>

## 6

```text
That looks right, I'll just trust it and move on.
```

<details>
<summary>Answer</summary>

Not really a prompt so much as a habit to avoid - see "Verify, Don't Trust" in `06-thought-process.md`. Confident-looking output still needs to be run and checked before you rely on it.
</details>
