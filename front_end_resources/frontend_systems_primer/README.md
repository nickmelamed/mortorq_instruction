# Frontend Systems Primer

This primer follows `back_end_resources/systems_primer` and assumes `web_fundamentals_primer` is done. That primer taught you to build a screen that behaves correctly; this one teaches you what changes once the data behind that screen is real, shared, and unreliable. Start with `00_intro/concept.md` if you haven't already.

## How this primer is organized

Like `systems_primer`, each topic teaches a system pattern through a real scenario, with code that stays honest about what it's a simplified stand-in for. Every topic continues extending `../scouting_app/`, exactly where `web_fundamentals_primer/04_hooks_and_lifecycle` left it. Each topic has:

- **`concept.md`** — the idea itself, explained through the scouting app's real constraints, plus an explicit callback to whatever it transfers from in `systems_primer`. Read this first.
- **Working code** — a slice of `../scouting_app/`, left runnable before you touch it and runnable after you're done.
- **`exercises/`** — one or more numbered exercise files with a clear done condition.

## Directory structure

```text
frontend_systems_primer/
├── 00_intro/                          Why this primer exists, and the "bad wifi, three scouts" framing
├── 01_consuming_apis/                 Real TBA/Statbotics data, CSV as a lightweight fallback, loading/error/empty states
├── 02_data_beyond_the_spreadsheet/    Light: why/how to persist data (Firebase/Supabase), and scouting notes -> LLM input
├── 03_state_as_a_systems_problem/     Local vs. app state, Context, explicit state-machine framing
├── 04_ui_ux_principles/               Fast, error-resistant entry under time pressure; mobile/tablet-first; accessibility
├── 05_offline_and_multi_user/         LocalStorage/IndexedDB offline capture, sync-on-reconnect, conflict resolution
├── 06_visualization_and_output/       Sortable tables, charts, a real pick-list -- the payoff module
├── 07_testing/                        Component testing with React Testing Library
├── 08_deployment/                     Git-to-deploy on Vercel, in real depth: env vars, preview deploys, CI/CD framing
└── README.md                          This file
```

## Suggested order

Work through `00` to `08` in order. `01`'s real data flows into everything after it; `05`'s offline-capture layer and `06`'s visualization both assume real data already exists to work with, and `08` assumes the app is otherwise finished.

## Setup notes

Needs [Node.js](https://nodejs.org/) (LTS) and `npm`, same as `web_fundamentals_primer` from `02_why_typescript` on. `01_consuming_apis` additionally needs a free [The Blue Alliance API](https://www.thebluealliance.com/apidocs) read key — see that topic's `concept.md` for how to get one and where it goes.
