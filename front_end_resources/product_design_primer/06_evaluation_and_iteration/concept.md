# 06 - Evaluation and Iteration: Finding Out Before a Real User Does

## Two cheap ways to find out you're wrong

Everything from `01` through `05` is still a set of decisions someone made, and the only way to know whether they hold up is to check — either against a known checklist, or against a real person. Both are cheap enough to do before anything ships, which is the point: a design flaw found here costs a rewrite of a doc; the same flaw found after launch costs a scout a broken tool mid-competition, the exact scenario `frontend_systems_primer/00_intro` frames its whole primer around.

## Heuristic evaluation: a checklist, no users required

Jakob Nielsen's ten usability heuristics are a general-purpose checklist for exactly this kind of review — a handful of the ones most relevant here:

- **Visibility of system status** — does the pick-list screen show that data saved, or does a scout have to guess?
- **Match between system and the real world** — does "alliance" mean the same thing here as it does at an actual event (see `01`'s and `04`'s red/blue discussion)?
- **User control and freedom** — can a scout back out of an entry they started by mistake, or are they stuck?
- **Consistency and standards** — does the same action (submit, cancel) look and behave the same way every time it appears (the exact problem `05`'s tokens exist to prevent)?
- **Error prevention and recovery** — does the design stop a bad entry before submit, or only complain after (`04_ui_ux_principles`'s `aria-invalid` work is a recovery mechanism; prevention would catch it earlier)?

Walk through your wireframe or hi-fi mockup against each heuristic and write down every place it fails, with a severity (cosmetic, minor, major, blocker) — not a vague "this feels off," a specific rule and a specific violation.

## Cheap usability testing: real users, small numbers

Nielsen's own research backs a specific, useful number: roughly 85% of usability problems in a design surface with just five test users; more users after that mostly re-find the same issues. A "test" here doesn't need a lab — hand someone your wireframe or a clickable mock, give them one task ("log this match's result" or "find out when your kid's team plays next"), say nothing else, and watch where they hesitate or go the wrong way. Where they get stuck is data. Where they succeed easily but you expected trouble is also data — it tells you that assumption was wrong too.

## Closing the loop

Evaluation isn't the last step in a line — it's the point where you go back to whichever earlier module the problem actually lives in. A heuristic violation about inconsistent buttons sends you back to `05`'s tokens. A user who couldn't find the submit button sends you back to `02`'s wireframe. A user who understood the screen fine but didn't actually need the feature at all sends you all the way back to `01` — the needs statement itself was wrong, not the design built from it. Knowing *which* module to revisit is itself the skill this module is teaching, more than either technique on its own.

## Putting it together

Run a heuristic evaluation pass (pick five of Nielsen's ten heuristics, including at least the ones above) against the screen you've carried through this primer, listing every violation with a severity. Then run a small usability check with one to three real people: give them one task and your wireframe or mockup, say nothing else, and record exactly where they hesitated or went off-path. For each finding from either method, name which earlier module (`01`-`05`) you'd actually need to revisit to fix it.

## Resources

- [Nielsen Norman Group: 10 Usability Heuristics for User Interface Design](https://www.nngroup.com/articles/ten-usability-heuristics/) - the full checklist this module draws five heuristics from.
- [Nielsen Norman Group: Why You Only Need to Test with 5 Users](https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/) - the research behind this module's usability-testing sample size.
- [How Complex Systems Fail](https://how.complexsystems.fail/) - the same essay referenced in `frontend_systems_primer/00_intro`; worth rereading here too, since evaluation is this primer's version of noticing a failure before it's live.
