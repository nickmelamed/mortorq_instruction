# Exercise 3: Write the Acceptance Criteria

## Goal
Practice defining success *before* writing any code — no editor needed for this one.

## Scenario
Pick one of the two options below (or a real mechanism or feature from your own robot or scouting app):

- **Hardware:** a climber mechanism that has to raise the robot and stop at a target height.
- **Software:** a scouting app feature that pulls the current match schedule from an external API before each match.

## Steps
Write short, plain-language answers to each of these — a few sentences each is enough, this is a spec, not an essay:

1. **Tolerance.** What counts as "close enough" to the target, and why that number and not a tighter or looser one? (For the climber: how many degrees or inches of error is fine? For the scouting app: how stale can the schedule be before it's a problem?)
   
2. **Timeout.** How long is too long to keep waiting before you conclude something's actually wrong, not just slow?
   
3. **Failure fallback.** When it fails outright (a stall, a dropped connection), what does the system do instead of hanging or crashing? Who or what finds out that it failed?
   
4. **Budget.** What's the actual constraint you're designing against — current draw and time for the mechanism, or request rate and latency for the API call — and where does that number come from (a spec sheet, a rule in the game manual, an SLA)?

## Self-Check
- [ ] Every answer has an actual number or a concrete condition in it; not "reasonably fast" or "a small amount of error," but a value you could put directly into code
- [ ] I can justify each number from something outside my own preference (a spec, a rule, a measurement, or a stated tradeoff), not just "it felt right"
- [ ] I wrote this before touching any code for the real version of this feature, not after

## Reflection
This is the exercise `13_designing_under_constraints/concept.md` is really about. Everything in `examples/tba_sync/` was written the wrong way around on purpose. The habit worth keeping is writing what you just wrote here *first*, so the code has something correct to be written against instead of something to be debugged into eventually matching.
