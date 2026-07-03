# Sample Prompt for Better Answers

To put everything together, we will walk through a quick problem where you can implement all of these tips.

## Case Study: Robot Sensor Log Validation

Your robot logs sensor readings to a .csv file during matches, and you need to validate that each row is properly formatted before running your post-match analysis.

You decide to use GenAI to speed up this process.

### Turn 1: Good Context + Constraints
Use the following prompt:

```text
You are a senior Python 3.11 engineer mentoring a beginner.

I am working on a function that parses a CSV row representing a sensor reading logged during a robot match.

Each row has this format:
sensor_name,reading,timestamp_ms

Rules:
- sensor_name: non-empty, no spaces
- reading: a float between -1000 and 1000 (inclusive)
- timestamp_ms: an integer between 0 and 150000 (inclusive) - our matches last 150 seconds

The function should:
- Return a dictionary with keys: sensor_name, reading, timestamp_ms
- Raise a ValueError with a clear message if validation fails

Please:
1. Restate the requirements in your own words
2. Outline a step-by-step approach (no code yet)
```

Why is this a good prompt?
- Role prompting to narrow scope of AI answers
- Explicit context that gives model clear idea of the problem
- Constraint-based prompting to structure your output in a format you can use
- Decomposition by encouraging a step-by-step approach so you can clearly see its thought process

### Turn 2: AI Response
We can assume the AI response:
- Restates rules
- Lists validation steps
- Mentions parsing, checking fields, raising errors.

If by any chance it doesn't (which is rare, but remember these outputs have randomness in them!), you can always re-prompt the AI with something simple like this:

```text
You mentioned that rule #2 looked like this: <wrong text>

However, change the rule so it reflects the original rule: <correct text>

```

Then, you should be on your way. You can apply similar logic to any follow-up steps - give the AI context and be direct with what you want changed!

### Turn 3: Consistency Lock + Feedback

Start off with this prompt:

```text
Looks good.

One clarification:
- The general reading range (-1000 to 1000) applies to most sensors
- But readings from the "gyro" sensor specifically must fall between -180 and 180 (degrees)

Update your requirements summary to reflect this.
Do not change the approach yet.
```

Why this is a useful follow-up:
- Acknowledging what's already correct ("Looks good") before asking for a change keeps the model anchored to the parts of its answer that don't need to move
- Force an explicit update with a genuinely new rule, so the model has to reconcile a general rule with a sensor-specific exception, rather than just repeating what it already said
- Prevent silent assumption drift by telling it to not alter the fundamental approach yet

### Turn 4: Approach Refinement

Once that is fixed, we can follow up with the actual approach change:

```text
Now revise the step-by-step approach to reflect the sensor-specific range rule for "gyro".

Keep it high-level.
```

Again, we reinforce the approach, while asking only to revise for the new sensor exception.

### Turn 5: Controlled Implementation Prompt

Now we are ready to have it give us some code in Python:

```text
Now implement the function in Python.

Constraints:
- Use only standard library features
- Keep the function under 25 lines
- Use clear variable names
- Do not add extra features

After the code:
- Briefly explain how each validation rule is enforced
```

We have tight constraints on our code. We also have some elements of Chain of Thought (CoT) because we are asking about how the validation rules are followed, and the "After the code: ..." line is Output Control - it tells the model exactly what shape the response after the code should take.

### Turn 6: Verification via Rule Restatement
At this point, we don't want to proceed without confirming that our model is following our rules.

Let's use this prompt to check that:
```text
Before we go further:

1. Re-list all validation rules, including the sensor-specific exception for "gyro"
2. For each rule, point to the exact part of the code that enforces it
```

This might seem a little repetitive, but AI's sometimes struggle with consistency in response - they might claim they implemented a rule (and maybe they did), but they could "forget" that rule in later responses. Here we check that the model understands why it is coding what it is coding.

If some rules are missing, simply ask for a rewrite using the given rules.

### Turn 7: Edge Cases
With almost every function, you will be dealing with some edge cases, particularly with real-world data like match sensor logs, which tend to have plenty of moving parts.

We ask for that with this prompt:
```text
Now test the function conceptually with these cases:

1. "front_ultrasonic,45.2,12000"
2. "gyro,270,5000"
3. "front_ultrasonic,1500,3000"
4. "   ,10,2000"
5. "gyro,-180,150000"
6. ""   (empty string)

For each case:
- Should it pass or fail?
- Which rule applies?
- What error message should be raised?

Do not change the code yet.
```

Why does this do a proper edge case check?:
- The list covers a spread of boundary conditions (a clean pass, a sensor-specific range violation, a general range violation, a malformed field, an inclusive boundary, and an empty string) rather than just one or two happy-path cases
- We also make sure we get some feedback on why those edge cases should pass or fail (out-of-range readings, the gyro-specific exception, malformed rows)

### Turn 8: Self Review
You can be fairly sure that the first "final" answer the model gives you will not be perfect. It may be *really* good, but it might not be exactly what you want. This will hold true especially as you produce more complex code.

One good way to find out what could be improved is with a prompt like this:

```text
Now review the final solution and answer:

1. One potential bug or limitation
2. One improvement you would suggest for a production system
3. One thing a beginner should remember from this example
```

Here, we check for any issues, possible improvements, and a basic summary that shows learning outcomes.

Before you consider this done, actually paste the final function into your own environment and run it against the six rows from Turn 7 yourself. The model's conceptual pass/fail answers are a good sanity check, not a substitute for seeing the real output - see Verify, Don't Trust in 05-thought-process.md.

## Recap: Techniques Used Per Turn

| Turn | Technique(s) |
| --- | --- |
| 1. Good Context + Constraints | Role prompting, explicit context, constraint-based prompting, decomposition |
| 2. AI Response | Direct, targeted correction of a specific error |
| 3. Consistency Lock + Feedback | Human-in-the-loop, consistency lock-in |
| 4. Approach Refinement | Targeted, incremental modification |
| 5. Controlled Implementation | Constraint-based prompting, Chain-of-Thought, output control |
| 6. Verification via Rule Restatement | Consistency verification |
| 7. Edge Cases | Boundary/edge-case testing |
| 8. Self Review | Self-critique / reflection |

You have now seen how prompting can give you much improved outputs - happy prompting and programming!
