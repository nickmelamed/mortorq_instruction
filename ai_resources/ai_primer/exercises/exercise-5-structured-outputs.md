# Exercise 5: Structured and Validated Outputs

## Goal
Get a model to produce a real structured output, then actually validate it against the schema you asked for instead of assuming it matched.

## Scenario
You're validating a batch of robot sensor log rows (same format as `02-common-prompts.md`'s Test Generation Prompt): `sensor_name,reading,timestamp_ms`. You want the result back as machine-parseable JSON, not prose, so it could be fed into another script.

Rows to validate:
```text
front_ultrasonic,45.2,12000
gyro,270,5000
,10,2000
gyro,-45,999999999
```

## Steps
1. Write a prompt that asks the model to return a JSON array, one object per row, with exactly these keys: `sensor_name` (string), `reading` (number), `timestamp_ms` (number), `valid` (boolean), `error` (string, empty if valid). Be explicit that valid rules are: non-empty `sensor_name`, `reading` between -1000 and 1000 (but -180 to 180 if `sensor_name` is `"gyro"`), `timestamp_ms` between 0 and 150000. State that no text should appear outside the JSON array.
2. Run it, and validate the raw response yourself using the four checks from `05-structured-and-validated-outputs.md`: does it parse, are the keys exactly right (no more, no fewer), are the types right (is `reading` a real number, not a quoted string), and are the `valid`/`error` values actually correct against the rules you gave it (in particular, check what it did with the third row's empty `sensor_name` and the fourth row's out-of-range `timestamp_ms`).
3. Deliberately add one soft, slightly conflicting instruction to your prompt - e.g., "also briefly explain your reasoning" - and re-run. Check whether this causes prose outside the JSON, a dropped/renamed key, or a type change anywhere.
4. Fix your prompt so the conflict from step 3 doesn't break the format anymore, and confirm with one more run.

## Self-Check
- [ ] My schema explicitly named every key and its type, not just "return it as JSON"
- [ ] I actually parsed the response (or traced through it by hand) rather than eyeballing that it "looked like" JSON
- [ ] I found at least one place where the raw output didn't match the schema on the first try - a wrong type, a missing key, a stray sentence, or a wrong `valid`/`error` judgment
- [ ] My final, fixed prompt produced a clean, schema-matching response on a re-run

## Reflection
Which specific failure mode from `05-structured-and-validated-outputs.md` (malformed syntax, prose wrapped around the structure, schema drift, or a type mismatch) did you actually observe? What part of your prompt do you think caused it, and what part of your fix addressed it?
