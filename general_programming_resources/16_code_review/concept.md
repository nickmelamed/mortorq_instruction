# 16 - Code Review

## A Second Set of Eyes

**Code review** means someone other than the author reads a change before it merges. It exists because the person who wrote a piece of code is the person least likely to spot what's wrong with it. Your brain tells you your code is fine, because it tells you what you meant to write, not what's on the screen. A reviewer has no such gap to fall into. `git_resources/CONTRIBUTING.md` already requires at least one review before a PR merges.

## What Reviews Check

Specifically:

- **Does it do what the PR description says it does?** `15_technical_communication`'s PR-description guidance ("what changed, why, how to test it") only pays off if a reviewer actually checks the code against that claim.
- **Is it actually tested**, the way the PR's "how to test" claims? If the description says "ran the climb routine and confirmed it settles within 2 seconds," did it, or is that aspirational?
- **Would this be readable to someone who wasn't in the room** when it was written; perhaps by the same reader `15_technical_communication` describes, who only has what's in front of them?
- **Is the diff itself clean** — the actual logic change, not a logic change buried inside an unrelated reformat (`11_style_linting`'s whole argument for why formatting-vs-logic noise makes review harder)?

## Blocking Issues vs. Nitpicking 

Not every comment on a PR carries the same weight, and a review that doesn't distinguish them is confusing to act on. A **blocking issue** is something that has to be fixed before this can merge; a real bug, a missed edge case, a test that doesn't actually cover what it claims to. A **nitpick** is a preference or a minor improvement that doesn't need to hold up the merge — a slightly better variable name, a comment that could be clearer. Label which is which, explicitly, every time: "blocking: this will throw if `readings` is empty" reads completely differently from "nitpick: could rename this to `sensorReadings` for clarity." Leaving that unstated forces the author to guess whether a comment needs a fix or can be safely ignored.

## How to Write a Review

- **Ask, don't command.** "This will throw a `NullPointerException` if `readings` is empty — is that guaranteed not to happen upstream, or should we guard for it here?" invites the author to explain something you might be missing, and still clearly flags the concern. "Fix this" doesn't.
- **Be specific.** Point at the exact line and the exact input or scenario that breaks, not a vague "this seems off".
- **Explain the why, not just the what.** "This duplicates the averaging logic in `SensorSmoother` — worth extracting?" teaches the author something they can apply next time.

## How to Receive a Review

A review comment is about the code, not about you. Two habits that make this go well on the receiving end: respond to *every* comment, even a one-word "done," so the reviewer knows you saw it and isn't left wondering if you missed it; and if you disagree with a comment, say why instead of silently ignoring it or silently doing what they said without believing it. A reviewer who's wrong needs to hear the actual counter-argument to learn something too.

## Putting it together

Open `examples/review_this_pr/pr_diff.md`, a real-shaped PR: a description that sounds reasonable, a small diff that looks like a fix, and a bug the description doesn't catch. Work through `exercises/exercise-1-review-a-real-pr.md`, where you review it yourself before checking whether you found the actual problem. `exercises/exercise-2-receive-the-review.md` flips the same PR around — now you're the author, responding to three comments that came back on it, including one worth disagreeing with.

## See also

- **`15_technical_communication`** — the PR-description skill this module's reviews are checked against; read that module first if you haven't.
- **`git_resources/CONTRIBUTING.md`** — the mechanical requirement (at least one review before merge) this module teaches the thinking behind.
- **`11_style_linting`** — why keeping formatting out of a logic-change diff is what makes reviews like this one fast instead of exhausting.
- **`17_pair_programming_and_workflow`** — review and pairing are two points on the same "more than one set of eyes" spectrum; review happens after the fact on a finished diff, pairing happens live.
- **`13_designing_under_constraints`** — `exercise-2`'s disagreement is grounded in that module's resource-budget thinking (avoiding allocation and autoboxing inside a periodic loop), not just a style preference.

## Resources

- [Google's Engineering Practices: The Code Review Process](https://google.github.io/eng-practices/review/reviewer/) — Google's own internal guide to reviewing, from the reviewer's side (pairs directly with the CL-description guide already cited from the author's side in `15_technical_communication`).
- [Wikipedia: Code review](https://en.wikipedia.org/wiki/Code_review) — a general overview of the practice, its history, and common formats beyond what this module covers.
