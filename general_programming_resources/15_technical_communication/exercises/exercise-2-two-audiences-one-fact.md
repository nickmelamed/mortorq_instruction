# Exercise 2: Two Audiences, One Fact

## Goal
Practice turning the abstraction dial deliberately, without changing what's actually true.

## Scenario
`15_technical_communication`'s concept.md already walks through the climber tolerance decision from `13_designing_under_constraints` at two abstraction levels. This exercise asks you to do the same thing yourself, for a different decision: the intake fix from `examples/messy_pr_description.md` (or your rewritten version from Exercise 1).

## Steps
1. Write a **for a fellow programmer** version: 2-4 sentences, technical detail included (the specific current values, which config changed, why 35A and not some other number if you can infer or invent a reasonable justification).
   
2. Write a **for a mentor or judge with no CS background** version: 2-4 sentences, no code, no specific amp values required. It should still be true, and still specific enough to show a deliberate decision was made, not just "we fixed a bug."
   
3. Read both versions back to back. Every claim in the judge version must be a fact a reader could also find true in the programmer version, just described at a different level of detail; if the judge version says something the programmer version doesn't support, that's not simplification, that's just wrong.

## Self-Check
- [ ] Both versions are about the same underlying decision, not two different decisions
- [ ] The judge version contains zero code syntax or config field names
- [ ] I can point to the specific sentence in my programmer version that supports every claim in my judge version
- [ ] The judge version is still specific. "We made it more reliable" is too vague; "we found the current limit had never been updated after we changed intake wheels, and fixed that" is specific without being technical

## Reflection
The hard part of this exercise usually isn't the technical version, it's resisting the urge to either dump implementation detail into the judge version, or hedge the judge version into something so vague it could describe almost any fix. Both are ways of avoiding the actual work, which is deciding what this specific reader needs to know.
