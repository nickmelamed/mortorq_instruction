# Exercise 3: Worth It, and Worth It Now?

## Goal
Practice two judgment calls `exercise-1` and `exercise-2` don't cover: whether an incident warrants a postmortem at all, and if it does, how much waiting has already cost you.

## Scenario
Three incidents, evaluated against `concept.md`'s "When a Postmortem is Too Much" and "Writing It Down While It's Fresh":

```text
1. A robot browned out mid-match during eliminations an hour ago, costing
   a possible playoff tiebreaker. Nobody's sure yet exactly why.
2. A scout accidentally entered the same match's data twice. Someone
   noticed before the next match started and deleted the duplicate.
   No decisions were made off the bad data.
3. A one-second communication dropout between the driver station and the
   robot happened three weeks ago, in practice, and was dismissed as a
   one-off glitch at the time. The same dropout has now happened twice
   more, in real matches, since.
```

## Steps
1. For each incident, decide: does this warrant a postmortem at all? Justify in one sentence using `concept.md`'s actual criteria (real cost, or plausible recurrence).
   
2. For each one that does warrant one, decide how urgently it should be written: today, sometime this week, or not time-sensitive. Justify against "Writing It Down While It's Fresh."
   
3. Incident 3 already lost three weeks. Write down two specific things a same-day writeup after the *first* dropout would have captured that are now permanently gone — not "more detail" in general, name actual categories of information (what the driver was doing at the moment, exact match/practice conditions, who else was watching and what they noticed).
   
4. Write the one-paragraph note you'd send your team lead explaining why incident 1 needs to happen today, not next week. Use `concept.md`'s actual reasoning for urgency, not just "because it's important."

## Self-Check
- [ ] I correctly identified incidents 1 and 3 as postmortem-worthy, and incident 2 as not
- [ ] My reasoning for incident 2 cites the actual criteria (no real cost, no plausible recurrence pattern), not just "it wasn't a big deal"
- [ ] I correctly identified incident 1 as the most time-urgent of the two worth doing
- [ ] I named two specific, concrete categories of information already lost from incident 3's three-week delay, not a vague "more detail"
- [ ] My incident-1 note gives a real reason for urgency drawn from `concept.md`, not an assertion of importance

## Reflection
Incident 3 is the one worth sitting with. It's genuinely postmortem-worthy — it's recurring, and it's now cost real matches — but "worth it" and "worth it now" got answered three weeks apart, and only one of those answers was still fully available by the time anyone acted on it. The team didn't skip the postmortem; they just didn't realize the first dropout was the start of one until the pattern had already repeated twice more, and by then the freshest, most specific information about what actually happened was gone for good. That's the real argument for treating "is this worth documenting" as a question worth asking the first time.
