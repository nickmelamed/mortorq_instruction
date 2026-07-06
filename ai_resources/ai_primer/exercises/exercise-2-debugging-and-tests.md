# Exercise 2: Debugging and Locking in a Fix

## Goal
Practice the Debugging Prompt pattern with a real traceback, then use Test Generation to make sure the fix actually holds, and verify it yourself. 

## Scenario
Below is a function that occasionally throws an `IndexError`:

```python
def get_last_reading(readings):
    """Returns the most recent sensor reading."""
    return readings[len(readings)]
```

If you have a real bug from one of our codebases instead, feel free to use that as well. 

## Steps
1. Run the code (or work out by hand) and get the real traceback.
2. Use the Debugging Prompt pattern from `02-common-prompts.md`, pasting the **exact** traceback, not a paraphrase.
3. Once you have a fix, use the Test Generation Prompt to get unit tests for it.
4. Actually run those tests yourself. Don't just trust the model's claim that the fix works.

## Self-Check
- [ ] I pasted the exact error/traceback, not a description of it
- [ ] I asked for the root cause, not just corrected code
- [ ] I ran the generated tests myself and confirmed they pass

## Reflection
Did the model's stated root cause match what you understood once you read the fix? If the tests it wrote were weak or missing a case, what was missing?
