# Exercise 1: Context and Explain-First

## Goal
Feel the actual difference between a poorly-contexted prompt and a well-contexted one, using your own eyes instead of just reading about it.

## Scenario
Below is a small motor-output clamp with a bug (it only clamps the upper bound):

```python
def clamp_motor_output(value):
    """Clamps motor output to the range [-1.0, 1.0]."""
    if value > 1.0:
        return 1.0
    return value
```

If you'd rather use a real bug from one of our codebases, swap it in for the rest of this exercise.

## Steps
1. Write a deliberately **poor** prompt for this bug (no error description, no expected behavior - just "fix my code" plus the snippet). Run it, save the output.
2. Now write a **well-contexted** prompt: include the code, what you expected vs. what actually happens, and the language/version. Run it, save the output.
3. Before looking at either output again, run an **Explain-First** prompt (see `02-common-prompts.md`) on the original snippet, with no mention of the bug at all. See whether the model spots the issue unprompted.

## Self-Check
- [ ] My well-contexted prompt included the actual code
- [ ] It stated expected vs. actual behavior explicitly
- [ ] It named the language/version
- [ ] I can point to a concrete difference in quality between the poor and well-contexted outputs (not just "the second one was better")

## Reflection
What specifically was missing from the poor prompt that made the model's first answer worse? Did the Explain-First prompt catch the bug on its own?
