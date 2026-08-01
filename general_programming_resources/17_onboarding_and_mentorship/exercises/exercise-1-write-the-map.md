# Exercise 1: Write the Map

## Goal
Write the onboarding artifact a newcomer to a real subsystem you know well would actually need — answering `10_reading_unfamiliar_code`'s own orientation questions about your own code, unprompted, before anyone has to ask.

## Scenario
Pick one real subsystem, module, or tool from an actual team codebase (not this instructional repo) that you personally know well — well enough that you've stopped noticing what's non-obvious about it to someone new. That's the target.

## Steps
1. Without looking anything up, write down: what's the entry point for this piece of code? How would a newcomer find it in under a minute?
2. What test coverage does it have, if any — and if it has none, say so plainly rather than skipping the question. (`10_reading_unfamiliar_code` treats "no tests here" as real information a newcomer needs, not an embarrassing gap to hide.)
3. Name at least one Chesterton's-fence-style decision in this code: a constant, a workaround, or an ordering that looks arbitrary but isn't. Write down *why* it's the way it is — the actual reason, not just "it works, don't touch it."
4. Turn steps 1-3 into a short, real doc (a README section, or a comment block at the top of the file, following `04_documentation`'s guidance on what belongs where) — written so a newcomer with zero context could read it and know where to start.
5. If you can, hand what you wrote to an actual newer teammate (or, if none is available, a partner who doesn't know this code) and ask them to try to use it to answer `10_reading_unfamiliar_code`'s own exercise-style questions about this code. Note anywhere they got stuck that your doc didn't cover.

## Self-Check
- [ ] I answered the entry-point question specifically, not vaguely ("start in `Robot.java`, look for the constructor call to X" — not "just look around")
- [ ] I stated test coverage honestly, including "none" if that's accurate
- [ ] I named a real fence-style decision and wrote down the actual reason it exists, not just that it shouldn't be touched
- [ ] My written doc is something a newcomer could actually read and act on, not notes only I could interpret
- [ ] If I tested it on a real person, I recorded at least one place they got stuck that my doc should have covered but didn't

## Reflection
The hardest part of this exercise usually isn't the writing — it's step 1 through 3 forcing you to notice what you've stopped noticing. Knowledge that's fully internalized stops feeling like knowledge at all; it just feels like "how things are," which is exactly why it's the first thing to go missing when the person who has it graduates or moves on. Writing it down while you still have it isn't extra work on top of understanding the code well — it's the last step of actually finishing that understanding, in a form that outlives you being the one person who has it.
