# Product Design Primer

This primer runs **in parallel** with `web_fundamentals_primer` and `frontend_systems_primer`, not after them. Those two teach you to build the screen correctly; this one teaches you to decide what the screen should be in the first place. You can start this before you've written a line of code.

## Scope

This is product and user-centered design — the thinking that happens before and alongside implementation. It is **not** visual/marketing design for social media or branding; that's a different skill and out of scope here.

## How this primer is organized

Same shape as the other two primers: each topic has a `concept.md` (read first) and an `exercises/` folder (a clear done condition, usually "produce this artifact"). The anchor project is the same one every other primer uses — `scouting_app`/`team_site` — but here you're working on paper (or a doc, or a whiteboard photo), not in code. A decision made here is meant to hand off directly into the other primers: the flow you map in `03_information_architecture_and_user_flow` is what `web_fundamentals_primer/01_foundations` builds; the tokens you define in `05_design_systems` are what `team_site`'s CSS should actually use.

## Directory structure

```text
product_design_primer/
├── 00_intro/                              Why this primer exists, and how it hands off to the code primers
├── 01_user_needs_and_problem_framing/      Who's using this screen, and what job it does for them
├── 02_prototyping_lo_fi_to_hi_fi/          Sketch → wireframe → hi-fi, and when to raise fidelity
├── 03_information_architecture_and_user_flow/  Screen/task flow mapping
├── 04_visual_design_fundamentals/          Color, type, spacing/grid, as decisions with reasons
├── 05_design_systems/                      A real, reusable token/component set, not a spec doc
├── 06_evaluation_and_iteration/            Heuristic evaluation, cheap usability testing, critique
└── README.md                               This file
```

## Suggested order

Work through `00` to `06` in order — each builds on the artifact the last one produced (needs statement → flow → wireframe → visual system → evaluation). There's no dependency on `web_fundamentals_primer` or `frontend_systems_primer` to start; the natural pairing is to do a module here before you build the corresponding piece in code, so the code primers are implementing a decision you've already made instead of making it up as you type.

## What this primer intentionally leaves out

- **Visual/marketing design** — social graphics, branding, illustration. Real skills, different discipline, not this primer's job.
- **Writing the code.** Every artifact here is a decision or a static mockup, not a working app. Turning it into a real screen is `web_fundamentals_primer`'s and `frontend_systems_primer`'s job.

## Setup notes

No tooling required — paper, a whiteboard, or a plain text/markdown file is enough for every module here. If you'd rather use a design tool (Figma, Excalidraw, etc.), that's fine, but it's never assumed.
