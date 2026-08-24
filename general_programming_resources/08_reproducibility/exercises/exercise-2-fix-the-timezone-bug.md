# Exercise 2: Fix the Timezone Bug

## Goal
Watch the exact same real-world moment produce a different, wrong answer depending on which timezone a machine happens to be set to. Then, fix it so the answer stops depending on that at all.

## Scenario
`examples/match_status/match_status.py` decides whether the next match is `"upcoming"` or `"completed"`, based on a match time computed 8 hours from whenever the script is first imported. Nothing about the question ("has this match happened yet") should depend on which machine you run this on.

## Steps
1. Run it three times, once per timezone, without changing your actual system clock:
   - `TZ="America/Los_Angeles" python3 match_status.py`
   - `TZ="Asia/Tokyo" python3 match_status.py`
   - `TZ="UTC" python3 match_status.py`

   Record the printed "System local time" and "Match status" line from each run.

2. All three runs happened within the same few seconds, asking about the exact same real-world instant. State, in one sentence, what you'd expect if the script were reproducible. Compare it to what you actually got. 

3. **Hypothesize**, per `06_debugging_methodology`: which line in `match_status.py` is responsible, and why does it behave differently depending on `TZ` specifically?

4. **Test your hypothesis directly**: read what `datetime.now()` (no arguments) actually returns — local time, tied to the system's timezone setting — versus `MATCH_TIME`, which was computed from UTC and then had its timezone information stripped off entirely (`.replace(tzinfo=None)`). Confirm this is really what's happening by adding a print statement that shows both values across two of your three runs.

5. **Fix it.** Make the comparison timezone-aware instead of comparing two naive values that secretly came from different frames of reference. Anchor both `MATCH_TIME` and `now` to the same explicit timezone (UTC is the simplest choice) instead of letting one of them silently depend on the machine it's running on.

6. Re-run all three `TZ` variants from step 1 against your fixed version and confirm all three now agree.

## Self-Check
- [ ] I recorded three different "Match status" results across the three original runs, for the same real-world moment
- [ ] I can state exactly which line mixes a UTC-derived value with a local-time value without recording which is which
- [ ] I confirmed my hypothesis with direct evidence (a printed value), not just by reading the code and assuming
- [ ] My fixed version prints the identical "Match status" result across all three `TZ` values
- [ ] I can explain, in one sentence, why anchoring both values to UTC — rather than picking one "correct" local timezone — is what actually makes this reproducible on any machine

## Reflection
Every individual execution looked completely reasonable in isolation; a status got computed, a string got printed, nothing crashed. This code was quietly assuming it would only ever run in one particular timezone, and nothing about the code, the README, or the output ever said so. `TZ`, like the lockfiles and seeded randomness elsewhere in this module, is one more piece of hidden machine state standing between "it worked when I ran it" and "it will work the same way for anyone."
