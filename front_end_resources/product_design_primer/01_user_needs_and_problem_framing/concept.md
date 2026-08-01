# 01 - User Needs and Problem Framing: Finding the Constraint Before You Design Around It

## The constraint you were handed, and where it actually came from

`frontend_systems_primer/04_ui_ux_principles` opens with a fact stated as given: a scout uses this app "standing up, in a loud pit or in the stands... with somewhere between 30 and 90 seconds" per entry. Every decision in that module — the 44px touch targets, the two-tap alliance toggle, refocus-after-submit — follows from that one sentence. Nobody derived it for you there; it was handed to you already-true, the same way a spec sheet hands you a motor's stall torque. This module is about how that sentence gets written in the first place, so the next time it's your job to write it, not someone else's.

That's the actual skill: **turning "I think users would like X" into "here's what a specific person is actually trying to do, and here's how I checked."** Skip this step and you design against a guess. Guesses are sometimes right, but you have no way to tell which times, and no way to notice when the guess was wrong until the thing is built and someone's standing in a pit unable to use it.

## Feature idea vs. actual need

"Add a dark mode toggle" is a feature idea — it names a solution before naming a problem. Ask why, once: *why* would dark mode help? "Because the screen is hard to read outdoors in bright sunlight" is the actual need, and it's a more useful sentence, because it doesn't lock in the solution. Dark mode might not even fix bright-sunlight glare (it can make it worse) — but higher contrast and larger text probably would, and you'd never get there if you started from "toggle" instead of "hard to read outdoors."

One why is usually enough to get from a feature request to a real need for a scope this size. If the answer to your first "why" is still a solution instead of a problem ("because dark mode is expected"), ask again. If you're past two or three, you've probably left the scouting app's actual context and wandered into generic best-practice-recitation — stop and check the answer against a real person doing a real task.

## Writing a needs statement

A needs statement has three parts, and all three have to be concrete or the statement is worthless:

```text
[Specific user], in [specific situation], needs to [specific action],
because [specific consequence if they can't].
```

For `scouting_app`:

> A pit scout, standing at the rail between matches with a phone in one hand, needs to log alliance color, teams, and score in under 60 seconds, because the next match starts before they're done and they'll lose track of what they just watched.

For `team_site`:

> A parent who's never seen a robotics competition, visiting the site before their first event, needs to find out what a "match" even is and when their kid's team is playing, because they showed up not knowing what they were walking into.

Notice what's absent from both: no mention of colors, layouts, frameworks, or components. A needs statement describes a person and a problem, not a screen. That's what makes it useful later — you can test an actual design decision against it ("does this alliance toggle help the pit scout hit 60 seconds?") without the statement itself having pre-decided the answer.

## Why this isn't a persona poster

A persona — "Alex, 16, loves robots, uses TikTok" — describes a type of person in the abstract, and most of what's on one (age, hobbies, a stock photo) never gets used to decide anything. A needs statement is narrower and testable on purpose: it names one situation and one consequence, and you can point at any design decision and ask "does this serve that sentence, yes or no." If a persona doesn't change what you'd build, it was decoration. If a needs statement doesn't change what you'd build, you wrote it wrong — go back and make it more specific until it does.

## Where the sentence actually comes from

The cheap, reliable version of this isn't a survey or a focus group — it's watching one real person attempt the task once, or asking them immediately afterward what they were actually trying to do (not what they'd *want*, which tends to produce feature ideas again). For `scouting_app`, that's standing next to an actual scout during a real or practice match and watching where they hesitate, mistype, or give up. For `team_site`, it's watching someone who's never seen an FRC event try to find match times on the current site and noting exactly where they get stuck. One observation, written down precisely, beats ten minutes of guessing what a hypothetical user "probably" wants.

## Putting it together

Write two needs statements using the template above: one for a real user of `scouting_app` (pit scout, drive coach, or strategist — pick one) and one for a real user of `team_site` (a prospective member, a parent, a sponsor). For at least one of them, base it on watching someone actually attempt the relevant task rather than on assumption alone. Then take one design decision that's already in the codebase — `frontend_systems_primer/04_ui_ux_principles`'s alliance toggle is a good target — and check it against your statement: does this decision serve the need you wrote down, or did you just happen to land on the same answer the original author did for a different reason?

## Resources

- [IDEO: Design Thinking - Needfinding](https://www.ideou.com/blogs/inspiration/what-is-design-thinking) - the "needfinding" framing this module's needs-statement exercise is built from.
- [Nielsen Norman Group: Personas - Study Guide](https://www.nngroup.com/articles/persona/) - what personas are actually good for, and the difference between a useful one and a poster.
- [Intercom: Jobs to be Done](https://www.intercom.com/blog/jobs-to-be-done-in-2-minutes/) - a two-minute read on job-to-be-done thinking, the same underlying idea as this module's needs-statement template, from a different angle.
