# Structured and Validated Outputs

## Why Ask for a Specific Format

Recall Output Control from `04-prompt-engineering.md`: asking a model to respond in a specific shape (a code block only, a fixed set of labeled sections) instead of free-flowing prose. This file goes deeper on that idea, because "give me a structured format" isn't just about tidiness, it's about making AI outputs usable. 

A human can skim a paragraph and pull out the number they need. If you're going to take a model's output and feed it into a computer, that output needs a predictable shape a program can reliably pull fields out of. The most common shape for this is **JSON** (JavaScript Object Notation): a text format built from key-value pairs, e.g. `{"sensor_name": "front_ultrasonic", "reading": 45.2, "timestamp_ms": 12000}`. You don't need to know JSON's full syntax to use this well, just the core idea: it's a flat, labeled, machine-parseable way to say "here are the fields, and here is what's in each one," instead of "here's a paragraph, go find it yourself."

## Asking for It

Requesting structured output uses the same Output Control technique from `04-prompt-engineering.md`, just aimed specifically at a parseable format:

```text
Return your answer as a single JSON object with exactly these keys:
- "valid" (boolean)
- "reason" (string, empty if valid is true)

No text outside the JSON object.
```

Being explicit about the exact keys, their types, and that nothing else should appear in the response all matter - a vaguer ask like "give me the result as JSON" leaves the model to decide what fields to include, and it will decide differently across different runs of the exact same prompt.

## What Actually Goes Wrong

Asking for a format doesn't guarantee you get it, for the same reason nothing about an LLM's output is guaranteed: it's generating plausible text, not running a strict template. The specific ways structured output breaks are worth naming, because each one is easy to miss if you're only skimming the response instead of checking it:

- **Malformed syntax** - a trailing comma, a missing closing brace, quotes used inconsistently. Looks right at a glance, fails the moment something actually tries to parse it.
- **Prose wrapped around the structure** - you asked for "only a JSON object" and got `Sure! Here's the JSON you asked for:` followed by the object, plus a closing sentence after it. Anything parsing this expecting *pure* JSON breaks on the extra text.
- **Schema drift** - the fields don't match what you asked for. A key gets renamed (`"reason"` becomes `"explanation"`), a key gets silently dropped, or an extra field appears that you never requested. This is easy to miss because the output still *looks* like valid JSON - it's just not the JSON you specified.
- **Type mismatches** - you asked for `"reading": <float>` and got `"reading": "45.2"` (a string instead of a number), or a boolean that came back as the string `"true"` instead of the literal `true`. Downstream code expecting a real number can fail or misbehave in ways that don't look like an obvious error.

None of these are rare edge cases - they're common enough that you should expect at least one of them on a long enough run of attempts, especially as the requested schema gets more complex or the surrounding prompt gets longer (recall from `01-context-is-key.md` that longer conversations already strain consistency).

## Validating What You Got Back

**Validating** an output means checking it against what you actually asked for before you trust or use it - not assuming the format is correct just because you asked nicely. A basic validation pass, doable by hand for small outputs:

1. **Does it parse?** Paste it into a JSON validator (or just try to load it in your language of choice) before assuming it's well-formed.
2. **Are the expected keys present, and only the expected keys?** Check for both a missing key and a surprise extra one.
3. **Are the types right?** Is the number actually a number, not a numeral wrapped in quotes? Is the boolean an actual boolean?
4. **Are the values sane?** A `"reading"` of `45.2` might be syntactically perfect and still be nonsense if the sensor in question can't physically report a value that high - format validity and correctness are two different checks, and passing the first one tells you nothing about the second.

For anything beyond a one-off check, you can also just ask the model to do the first pass for you: "check that your last response is valid JSON matching the schema I gave you, and fix it if not" is a legitimate, useful prompt. But this doesn't remove the need for you to also check it yourself, because the model checking its own output is subject to the exact same failure modes as the output it's checking.

## Try It

You'll deliberately try to break a structured-output request, then validate what comes back.

1. Ask a model for a structured response to a real task, being explicit about the schema, e.g.: *"Given this list of sensor readings: `front_ultrasonic,45.2,12000` / `gyro,270,5000` / `,10,2000` - return a JSON array where each element has keys `"sensor_name"`, `"reading"` (number), `"timestamp_ms"` (number), and `"valid"` (boolean, false if any field is malformed). No text outside the JSON array."*
2. Check the raw response against the four validation questions above: does it parse, are the keys exactly right, are the types right, are the values sane (in particular: what did it do with the malformed third row, which has an empty `sensor_name`)?
3. Now deliberately push it toward breaking: ask the same question, but add "keep your explanation brief" before the schema instructions. See whether adding that one soft, conflicting instruction causes it to add prose outside the JSON, drop a field, or otherwise drift from the schema.
4. Write down which specific failure mode from this file (if any) showed up in step 3, and fix your prompt so it doesn't happen again - then re-run to confirm the fix worked.
