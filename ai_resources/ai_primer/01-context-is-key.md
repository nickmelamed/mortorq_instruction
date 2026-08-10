# Context is Key

## Why Context Matters

Context is the input, or information, you give the model to get an output, or answer. You give the model context in the form of prompts, which are the delivery mechanisms of providing these instructions. Prompts can be written questions, written instructions, images, etc. and any combination of the above.

Text is still the most common way people prompt, but image upload is standard now, not a paid extra; the free tier of ChatGPT, Claude, and Gemini all accept them. This is genuinely useful for robotics: a photo of a wiring fault, a screenshot of a build error, a picture of a whiteboard sketch of a state machine, all work as context alongside (or instead of) typing everything out. The same rules from this file still apply: an image is only as useful as what it actually shows the model, so a blurry or badly-cropped photo helps about as much as a vague text prompt does.

Since models cannot read your mind (at least not yet, anyway), the answer you get from them will only be as good as the context you give them.

Good context usually includes a few things:
- The relevant code itself (not your whole project, just what's related)
- Any error messages or stack traces, copied exactly as they appear
- What you expected to happen vs. what actually happened
- What you've already tried
- Your environment: language/library versions matter, especially in a fast-moving framework like WPILib, since the model may default to an older version than the one you're using

For example, say we create a function to calculate someone's age based on their birthday. However, we haven't taken into account the day/month, just the year, so some ages might be wrong.

Below is a poor way to prompt (or ask) the AI to fix this issue:

```text
Fix my code:

def calculate_age(birth_date):
    today = datetime.date.today()
    age = today.year - birth_date.year
    return age
```
The model has no idea what to fix here! Sure, it may figure out the problem, but why make it do the guessing? It opens up room for error, or at the very least, unnecessary token spend. 

Instead, you should point out the error in the function, and be a little more specific in what exactly you want the model to do:

```text
I've built out the below function to calculate age given date of birth. It currently only takes into account year, but it needs to account for month and day. My function is below:

def calculate_age(birth_date):
    """
    Calculates age based on birth_date (datetime.date object).
    """
    today = datetime.date.today()
    # Potential Bug: This doesn't account for the current month/day
    age = today.year - birth_date.year
    return age

```

Now, the model knows what our function is supposed to do, what it currently does, and what it needs to do to close that gap.

A good analogy for this is imagine I asked you to write a 2 page biography on a random person, but I only gave you their name, hometown, and one of their hobbies. You'd probably start making up a lot of information to fill that 2 page requirement. If I instead let you talk to the person, look them up online, etc. you would be much more well-prepared to write a strong 2 page bio. 

## Beyond Copy-Paste

Pasting a snippet inline works fine for small examples, but you'll hit its limits fast once you're working with real files. Most chat tools have built-in features for supplying more, or longer-lived, context without retyping it every message:
- File uploads, so you can hand over a whole file instead of retyping it
- "Projects" (ChatGPT Projects, Claude Projects), which keep a set of files and instructions attached across an entire thread of conversations
- Custom instructions, where you set standing preferences once (e.g., "I'm using Java with WPILib 2026") instead of repeating them every prompt

These are worth exploring once you outgrow single-snippet prompting.

## Be Careful What You Share

Context works both ways: whatever you paste or upload is now sitting on someone else's server. Depending on the provider's policies, that content may be stored, logged, or even used to help train future models. Remember, this applies to images just as much as text.

Avoid sharing things like:
- Proprietary or competition-sensitive code/strategy (e.g., your team's unreleased autonomous routines, or a whiteboard photo of one)
- Sponsor information, personal data, or anything else you wouldn't want made public

When in doubt, treat a chat with a public AI model the same way you'd treat a public forum post. And never be afraid to ask a mentor, another student, or consult FRC guidelines! 

## Limits to AI Usage

Unfortunately, we do not have an unlimited amount of text we can exchange with the model in a single conversation. AI companies let you access their models for "free" because they charge you on a usage basis via **tokens**. 

### Tokens

Every character that you type into the prompt takes up tokens, which are units of text that the AI processes. Additionally, anything that the AI outputs takes up tokens as well! A general rule of thumb is that 100 tokens is roughly 75 words, but this does vary a bit from model to model.

### Context Windows

The maximum number of tokens in a given conversation with a model is known as the context window. In general, LLMs are "stateless" in that they do not remember past prompts. However, if you haven't used up the entire context window, the LLM will remember your past questions and use that as context to answer your newer questions. However, there is a point where more context is not better. As context gets larger, the LLM tends to "forget" what came in the middle (known as the Lost in the Middle Effect), meaning you still want to avoid creating massive contexts even within the same window! 

It is **crucial** that you conserve tokens to avoid these kinds of problems. 

### How to Conserve Tokens
There are a few ways you can avoid running through your context window too quickly:
- Be concise; get to the point, don't write an essay where it isn't needed (e.g., instead of "Hi there, can you help me with..." say "Perform this task")
- Keep conversations on a single topic; if you need help with an unrelated problem, start a new conversation
- Request efficient formats (literally ask the model for structured outputs like JSON, for example) to avoid verbosity that burns through tokens 

Ultimately, your context window depends on your model, and providers update these limits often, so check the current docs for exact numbers rather than trusting a number you read a while back. As a reference point at time of writing, GPT-4o mini has a context window of about 128K tokens, though it caps any single response at a smaller ~16K output tokens. For a sense of scale, 128K tokens is roughly 300 pages of plain text. This might sound like a lot, but a handful of back-and-forth turns with full files, error logs, and re-explanations can burn through a surprising chunk of that faster than you'd expect.

## Resources

- [Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/abs/2307.03172) - the paper behind the Lost in the Middle Effect mentioned above (paper)
- [What are tokens and how to count them?](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them) - OpenAI's own explainer on tokens (instructional)
- [OpenAI Tokenizer](https://platform.openai.com/tokenizer) - paste in text and watch it get split into tokens live (tool)
- [Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) - Anthropic's engineering blog on managing context at scale, a preview of ideas covered in `agent_primer` (blog)