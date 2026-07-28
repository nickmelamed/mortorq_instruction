# Exercise 2: Rewrite the README

## Goal
Turn a real, information-dense but badly organized project description into a README someone could actually use.

## Scenario
`examples/messy_README.md` describes the same `ShooterConfig.java` from Exercise 1. Every fact in it is *true and useful* — that's what makes it worth fixing rather than throwing out — but it's all one run-on paragraph with no structure: setup instructions are buried mid-sentence, usage is described as a line-by-line account of what each method does internally, and the single most important fact in the whole thing (why `FLYWHEEL_RPM` is `4500`) is tacked onto the very end as an afterthought.

## Steps
1. Read `messy_README.md` fully and list out every distinct fact it contains, one per line, in your own words.
2. Sort those facts into three groups: **what this is/does**, **how to set it up**, and **how to run it**.
3. Write a new README with a clear heading for each of those three groups, using code blocks for the actual compile/run commands instead of describing them in prose.
4. Decide what to do with the `FLYWHEEL_RPM = 4500` rationale: it's implementation detail, not usage instruction, so it doesn't belong in "how to use this" the way the original buried it. If you completed Exercise 1, point out (in one line, in the README) that the reasoning now lives as a comment in the code itself, instead of duplicating the full explanation in both places.
5. Keep your rewritten version under half the length of the original — if you're restating implementation detail the code already documents, cut it.

## Self-Check
- [ ] The README has distinct, clearly headed sections for what/setup/usage
- [ ] Compile and run commands appear in code blocks, not prose
- [ ] No sentence describes what a method does internally, line by line
- [ ] The `FLYWHEEL_RPM` rationale is mentioned once, briefly, with a pointer to the code comment rather than a full restatement
- [ ] Your version is noticeably shorter than the original

## Reflection
The original wasn't missing information — it had all the right facts, just no structure to help a reader find the one they needed. That's the most common way real READMEs go bad: not from being wrong, but from being an undifferentiated wall of text where "what does this do" and "how do I run it" and "why is this constant what it is" are all mixed into the same paragraph with equal weight. Structure is what turns a pile of true facts into something a new reader can actually use.
