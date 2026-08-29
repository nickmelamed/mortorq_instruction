# 19 - Postmortems & Incident Review

## Postmortems

A **postmortem** is a type of analysis with the goal of not fixing the bug again, but deciding on whether or not a similar failure can happen again. Then, deciding on the best course of action to prevent that from happning.

## Blameless Postmortems 

A **blameless postmortem** looks for the gap in the system or process that let a failure happen. Compare two ways of writing up the exact same brownout:

> "Jonathan forgot to check the battery before the match."

> "There was no pre-match checklist step that would have caught this."

The first one is a dead end: it explains one match, teaches nothing repeatable, and plays the blame game instead of focusing on productive instructions. The second one is fixable, because it applies to every match from here forward, for every person on the team, not just the one who happened to be standing there this time.

A process that punishes whoever's name ends up in the writeup trains everyone to leave their name out of it. The next postmortem, written under that same pressure, has worse information than this one. Blameless isn't just about being nice, it's the only version of this process that produces an honest record.

## Anatomy of a Postmortem

A postmortem worth having covers four things, in this order:

- **Timeline** — what happened, in order, with real timestamps or match-clock references. Facts only. Don't reach for a cause yet, simply get the sequence correct. 
- **Root cause** — the actual mechanical, logical, or process reason. Don't get caught up in symptoms, as they can be a misleading indicator as to what actually caused the problem.
- **Contributing factors** — plural, on purpose. A brownout is almost never one cause acting alone.
- **Concrete follow-up action, with an owner and a deadline** — not "be more careful." "Be more careful" isn't checkable and doesn't survive contact with the next build season. "Add a current limit to the climber motor controller — Jordan, before next event" is checkable: someone can confirm it happened, and everyone knows who to ask.

## Writing it Down While it's Fresh

Do this within a day or two, not weeks later. The exact sequence of a fast-moving incident — what the driver saw, what order the lights on the robot changed, who said what over the radio — decays out of memory fast. 

## When a Postmortem is Too Much

Not every lost match needs a formal writeup. A postmortem earns its place when something cost real time, points, or safety, or when it plausibly recurs if nobody addresses it. It is not for a one-off fluke with an obvious, already-fixed cause that nobody's going to trip over again.

## Putting it Together

Open `examples/vague_incident_recap.md`; it has a real-feeling writeup of a fictional Match 14 brownout during an endgame climb. It names someone as the cause, hedges on what actually happened, and includes a block of raw facts (a battery voltage reading, timestamps, a pit note) that nobody in the recap actually checked against their own theory. Work through `exercises/exercise-1-write-the-postmortem.md` to find out what really happened and turn it into a postmortem that could actually prevent it from happening again, then `exercises/exercise-2-blameless-vs-blame-y.md` for a shorter drill on reframing blame-y language on its own. `exercises/exercise-3-worth-it-and-worth-it-now.md` picks up the two judgment calls the first two don't touch: whether an incident is worth a postmortem at all, and what waiting too long to write one actually costs.

## See also

- **`06_debugging_methodology`** — the five-step loop this module picks up after; a postmortem's root-cause section reuses its hypothesize-then-test discipline instead of accepting the first plausible story.
- **`08_reproducibility`** — an unwritten assumption that caused a "works on my machine"-shaped bug is exactly the kind of thing a postmortem's contributing-factors section exists to surface and fix for good, instead of quietly working around it again next time.
- **`18_onboarding_and_mentorship`** — the same "write it down while you still remember" discipline, aimed at an incident instead of a design decision worth flagging for the next person.
- **`15_technical_communication`** — a postmortem is one more artifact written for a reader who wasn't in the room; its "lead with the conclusion" habit applies directly to a postmortem's own summary line.

## Resources

- [Google SRE Book: Postmortem Culture — Learning from Failure](https://sre.google/sre-book/postmortem-culture/) - the standard industry reference for running blameless postmortems at real scale, including how to decide what actually warrants one.
- [Wikipedia: Just culture](https://en.wikipedia.org/wiki/Just_culture) - the underlying safety-science idea this module's "blameless" framing is drawn from, developed originally in aviation and healthcare, where the cost of hiding a mistake is measured in more than a missed climb.
