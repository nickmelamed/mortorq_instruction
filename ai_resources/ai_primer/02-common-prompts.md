# Common Prompt Patterns for Programming

This file has some common prompts that you can use to get better results for your programming. It is important to note that none of the wording must be copied exactly; the most important thing is understanding the general concept and how it changes LLM behavior. Also, this is not nearly an exhaustive list, but this is a good start to get you comfortable with coding with LLM assistance.

## Explain-First Prompt

Sometimes, you want to ask the model to explain a concept to you, or explain some code that you received but don't understand. Below is a good way to ask:

```text
Explain how this function works line by line, and tell me why each step is necessary.

def calculate_age(birth_date):
    """
    Calculates age based on birth_date (datetime.date object).
    """
    today = datetime.date.today()
    # Potential Bug: This doesn't account for the current month/day
    age = today.year - birth_date.year
    return age
```

The model should give you a line by line breakdown, from the function argument to the docstring to what the calculations being done are.

## Debugging Prompt

You will inevitably run into code that needs debugging, or solving an issue. A good way to handle this could be providing the error and code, and asking some questions so you can see the rationale. For example:

```text
I'm seeing the below error with my code:

while True print('Hello world')
  File "<stdin>", line 1
    while True print('Hello world')
               ^^^^^
SyntaxError: invalid syntax

Please:
1. Identify the root cause
2. Explain the cause in simple terms
3. Show a corrected version of the code
4. Explain how to avoid this mistake in the future
```
The model has your error, your code, and will also explain why this happened, give you corrected code, and teach you how to avoid this in the future.

## Test Generation Prompt

AI is genuinely good at brainstorming test cases, including ones you might not think of yourself. Once a function is working, it's worth asking for a set of tests before you consider it done:

```text
Write unit tests for this function using pytest. Include normal cases, boundary cases, and at least one invalid input.

def calculate_age(birth_date):
    """
    Calculates age based on birth_date (datetime.date object).
    """
    today = datetime.date.today()
    if today.month < birth_date.month or (today.month == birth_date.month and today.day < birth_date.day):
        return today.year - birth_date.year - 1
    return today.year - birth_date.year
```

The model will give you a set of test functions you can run directly, which is a much faster way to stress-test your code than checking it by hand.

## Incremental Build Prompt

Sometimes, you are starting with an overall solution idea (e.g., building out vision capability in the robot), but you don't know where to start. Since the final code will likely be fairly long, we probably don't want the whole solution all at once. The model will almost certainly give us subpar code. We should ask for things in steps, like this:

```text
I want to write a file that performs perspective projection on a given object. First, lets define the dependencies I would use.
```

Once you get those dependencies, you can ask follow ups like:

```text
Now, build out a basic projection of a 2D object in Java
```

## Code Review Prompt

After finishing a code file, it is always good to get a second set of eyes on it. Ideally, it would be one of your teammates, but sometimes it is good to get another perspective. You can simply paste your code (assuming it isn't too long) at the end of a prompt like this:

```text
Review this code, pointing out bugs, style issues, efficiency concerns, and any security issues.
```

Remember, if your code file is rather large, you can always split it into pieces, but make sure the pieces are **independent** of each other. If they rely on one another, the model may break them by giving different responses.

The model will give you some feedback and you can use this to change your code accordingly.

## Refactoring Prompt

Your code might be working just fine, but there could be a less verbose way to write it, or a more "proper" way to rewrite your code (e.g., in Python, there are certain practices that are considered "best" when it comes to writing code). You can do this with the below prompt (paste your code after the text):

```text
Refactor this code (Python 3.11) to be more readable and Pythonic, but ensure that the behavior remains the same
```

Naming your language/library version, like we did here, matters more than it might seem - it keeps the model from suggesting syntax or features your version doesn't actually support.

It is important to make sure the LLM only changes the syntax and not the actual function of the code!

## Resources

- [Prompt Engineering Guide: Techniques](https://www.promptingguide.ai/techniques) - a well-organized reference covering most of these patterns and more (instructional)
- [OpenAI: Prompt Engineering](https://platform.openai.com/docs/guides/prompt-engineering) - OpenAI's own strategies for reliable outputs, including testing prompt changes systematically (instructional)
- [Anthropic Prompt Library](https://docs.anthropic.com/en/resources/prompt-library/library) - a library of ready-made prompt examples for common tasks (instructional)
- [pytest: Get Started](https://docs.pytest.org/en/stable/getting-started.html) - official docs for the testing framework used in the Test Generation Prompt (docs)
- [dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide) - a huge, actively maintained collection of guides, papers, and notebooks if you want to go deeper (extra reading)

