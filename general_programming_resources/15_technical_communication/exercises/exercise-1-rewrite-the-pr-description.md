# Exercise 1: Rewrite the PR Description

## Goal
Turn a real-but-badly-shaped PR description into one a reviewer who wasn't there could actually use.

## Scenario
Open `examples/messy_pr_description.md`. Every fact a good PR description needs is actually in there — the what, the why, and how it was tested — but it's one run-on paragraph with no structure, and the most important fact (the current limit was completely unset, not just too high) is buried in the middle of a sentence about something else.

## Steps
1. Read it once and, without looking back at it, write down in one sentence what you think actually changed and why. If you can't do this confidently after one read, that's the problem this exercise is about.
   
2. Rewrite it using the **what / why / how to test** structure from `git_resources/CONTRIBUTING.md`, applying `15_technical_communication`'s "lead with the conclusion" idea: the reader should know what changed and whether it's safe to merge within the first sentence of each section, not at the end of a paragraph.
   
3. Don't add facts that aren't in the original — this is a restructuring exercise, not a rewrite-from-imagination exercise. Everything you need is already there.
   
4. Keep the line about the auto-routine timing check that hasn't happened yet; that's a real, useful thing for a reviewer to know before approving, don't lose it just because it doesn't fit neatly into what/why/how-to-test.

## Self-Check
- [ ] A reviewer could state what changed and why after reading only my "what" and "why" sections, without needing the rest
- [ ] My "how to test" section is specific enough that someone else could actually follow it and know whether it passed
- [ ] I didn't invent any fact that wasn't already in the original
- [ ] The unresolved auto-timing concern is still visible somewhere in my version

## Reflection
Nothing about the underlying change got more complicated between the original and your rewrit. It has the same facts, same fix, same test. The only thing that changed is whether a reviewer has to dig for the important part or gets handed it directly. That gap is the entire skill this module is about.
