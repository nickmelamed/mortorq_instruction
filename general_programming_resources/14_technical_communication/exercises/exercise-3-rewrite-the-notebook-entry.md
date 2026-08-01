# Exercise 3: Rewrite the Notebook Entry

## Goal
Turn a real week's worth of debugging into a notebook entry a judge could actually score.

## Scenario
Open `examples/messy_notebook_entry.md`. It's an honest, accurate log of a real week — nothing in it is wrong — but it never once states what the team actually decided or why, and a judge reading it would have to piece that together from five days of chronological narration on a tight per-team schedule.

## Steps
1. Identify the actual decision buried in the log: what does the auto routine do now, and why, compared to what it did at the start of the week?
2. Identify the constraint that forced the decision: what specifically was wrong with the simpler approach (timing-based auto) that the team couldn't just tune their way around?
3. Rewrite the entry using **problem → constraint → decision → why**, from `14_technical_communication`'s concept.md: state the problem the team was solving, the constraint that ruled out the simple fix, the decision they landed on, and why that decision addresses the constraint. Keep it to a few sentences — a judge is not reading five days of raw log, they're reading your summary of it.
4. Optionally, keep a short "how we got here" note *after* the summary for a reader who wants the detail — but the summary has to stand on its own without it.

## Self-Check
- [ ] The first sentence of my rewrite states what the team actually decided, not what they tried first
- [ ] A reader who stops after my first two sentences still knows the real constraint (carpet-dependent friction breaking timing-based auto), not just "it wasn't working"
- [ ] I did not just compress the five days into a shorter chronological summary — the shape is problem/constraint/decision/why, not a shorter version of Tuesday-Wednesday-Thursday-Friday
- [ ] Someone who has never seen this robot could explain, in one sentence, why the team chose sensor-based stopping over timing after reading only my rewrite

## Reflection
The original log and your rewrite describe the exact same week of work. The version that scores well in a judging interview isn't the one with more detail or more honesty about the process — it's the one that answers the question a judge is actually asking, which this module's concept.md names directly: did this team understand the problem and make a defensible choice.
