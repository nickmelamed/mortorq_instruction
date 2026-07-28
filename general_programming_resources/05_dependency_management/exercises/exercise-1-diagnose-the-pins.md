# Exercise 1: Diagnose the Pins

## Goal
For each dependency in a real `requirements.txt`, decide whether its version is pinned too loosely, too tightly (and gone stale), or reasonably — and justify each call using semver.

## Scenario
`examples/scouting_tool/requirements.txt` lists four dependencies for a small scouting stats tool:

```text
numpy
pandas==1.2.0
requests>=2.0
zero_pad==0.1.0
```

Each line has a different pinning problem (this exercise ignores `zero_pad` — that one's Exercise 2's job).

## Steps
1. For `numpy` (no version at all): explain, in terms of semver, exactly what can go wrong the next time someone runs `pip install` on this file, with no changes to the file itself in between.
2. For `pandas==1.2.0`: look up (or estimate, if you don't have internet access, based on what you know about how old this version is relative to pandas' current releases) roughly how far behind current this pin is. Explain what this project is missing out on by staying pinned here indefinitely, and what could still go wrong even though it's pinned "safely."
3. For `requests>=2.0`: explain why this range is too permissive, using the same MAJOR/MINOR/PATCH reasoning from `concept.md` — what's the worst version this line would currently allow to install, and is that actually safe?
4. Rewrite all three lines with ranges you'd actually be comfortable shipping, and add a one-line comment next to each explaining your reasoning (e.g., "allows patch/minor updates, blocks the next major version").

## Self-Check
- [ ] I can state, for each of the three lines, specifically what could go wrong under the original pin
- [ ] My rewritten `numpy` line no longer accepts every possible future version unconditionally
- [ ] My rewritten `requests` line blocks at least the next major version bump
- [ ] Every rewritten line has a comment explaining the reasoning, not just the new number

## Reflection
Notice that "no version pin" and "too-loose version pin" (`numpy`, `requests`) and "pinned but stale" (`pandas`) are three different problems that all look like "this line is fine, it has *a* version constraint" at a glance. None of them are wrong because someone made an obvious typo — they're wrong because whoever wrote them didn't think through what the constraint actually permits over time. That's the entire skill this exercise is practicing: reading a version range the way you'd read any other piece of code, for what it actually does, not what it was probably intended to do.
