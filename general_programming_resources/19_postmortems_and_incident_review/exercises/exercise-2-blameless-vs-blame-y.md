# Exercise 2: Blameless vs. Blame-y

## Goal
Practice reframing blame-y sentences around the missing system or process safeguard, without losing the actual technical fact each one is trying to report.

## Scenario
Real incident recaps often bury a genuinely useful technical fact inside a sentence that names a person instead of a gap. Below are five such sentences, each pulled from the kind of recap `examples/vague_incident_recap.md` is an example of.

```text
1. Jordan forgot to re-torque the climber bracket after quals 8.
2. Nobody bothered to check the current limit before the event.
3. Sam should have known the intake sensor was flaky by now.
4. Whoever wrote the autonomous routine never tested it against a full match clock.
5. The pit crew missed that the battery was swapped in wrong.
```

## Steps
1. For each sentence, write down the actual technical fact being reported. Strip out the person's name and the judgment attached to it.
   
2. Rewrite each sentence around the missing check, step, or safeguard that would have caught the problem, instead of the person who happened to miss it. Follow `concept.md`'s example: "there was no pre-match checklist step that would have caught this," not "someone forgot."
   
3. For at least one of the five, write the concrete follow-up action a real postmortem would attach to your rewritten version — an owner and a deadline, per `concept.md`'s anatomy.

## Self-Check
- [ ] None of my five rewrites name a specific person as the cause
- [ ] Each rewrite identifies one concrete, addable safeguard (a checklist step, a config default, a test, a review step), not a vaguer restatement of the same sentence
- [ ] My one follow-up action has both an owner and a deadline

## Reflection
Every one of these five sentences is trying to report a real, useful fact. None of that information should be lost in a blameless rewrite; only the "whose fault is it" framing should go. A blameless postmortem isn't a softer version of the truth; it's the same technical fact, aimed at the process gap that let it happen instead of the person standing closest to it.
