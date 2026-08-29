# Exercise 1: Write the Map

## Goal
Write the onboarding artifact a newcomer to a real subsystem you know well would actually need.

## Scenario
Pick one real subsystem, module, or tool from an actual team codebase (not this instructional repo) that you personally know well.

## Steps
1. Without looking anything up, write down: what's the entry point for this piece of code? How would a newcomer find it in under a minute?
   
2. What test coverage does it have, if any. If it has none, say so plainly rather than skipping the question.

3. Name at least one Chesterton's-fence-style decision in this code: a constant, a workaround, or an ordering that looks arbitrary but isn't. Write down *why* it's the way it is.
   
4. Turn steps 1-3 into a short, real doc (a README section, or a comment block at the top of the file, following `04_documentation`'s guidance on what belongs where), written so a newcomer with zero context could read it and know where to start.
   
5. Add a rough box-and-arrow sketch alongside the prose, per `concept.md`'s "Leave a Map" section. A few boxes and arrows is enough.
   
6. If you can, hand what you wrote to an actual newer teammate (or, if none is available, a partner who doesn't know this code) and ask them to try to use it to answer `10_reading_unfamiliar_code`'s own exercise-style questions about this code. Note anywhere they got stuck that your doc didn't cover.

## Self-Check
- [ ] I answered the entry-point question specifically, not vaguely ("start in `Robot.java`, look for the constructor call to X" — not "just look around")
- [ ] I stated test coverage honestly, including "none" if that's accurate
- [ ] I named a real fence-style decision and wrote down the actual reason it exists, not just that it shouldn't be touched
- [ ] My written doc includes an actual sketch, not prose alone
- [ ] My written doc is something a newcomer could actually read and act on, not notes only I could interpret
- [ ] If I tested it on a real person, I recorded at least one place they got stuck that my doc should have covered but didn't

## Reflection
The hardest part of this exercise usually isn't the writing. It's about spotting what needs to be explained, that you tend to take for granted. Writing things down while you still have them fresh in your mind is the last step of actually finishing that understanding.
