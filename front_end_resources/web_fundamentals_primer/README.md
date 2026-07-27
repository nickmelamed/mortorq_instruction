# Web Fundamentals Primer

This primer follows `back_end_resources/language_primer`. That primer taught you to write code in three languages; this one teaches you to write code that runs in a browser. Same job as `language_primer` — mechanics, tools, syntax — aimed at a different target. Start with `00_intro/concept.md` if you haven't already.

## How this primer is organized

Like `language_primer`, each topic teaches one concept and pairs it with real, runnable code — here, that code is always a slice of the same app: an FRC scouting form. Each topic has:

- **`concept.md`** — the idea itself, explained with minimal prose, plus an explicit callback to whatever from `language_primer` or `systems_primer` it transfers from. Read this first.
- **Working code** — either `01_foundations/scouting-form/` (plain HTML/CSS/JS, no tooling) or a slice of `../scouting_app/` (from `02_why_typescript` on), left runnable before you touch it and runnable after you're done.
- **`exercises/`** — one or more numbered exercise files with a clear done condition. Some are "extend this," some are "this is broken, find out why."

## Directory structure

```text
web_fundamentals_primer/
├── 00_intro/                 Why this primer exists, and what you'll have built by the end
├── 01_foundations/           Semantic HTML, CSS box model/flexbox/grid, DOM & events, async JS
├── 02_why_typescript/        Static typing tradeoffs, continuing the typing thread from language_primer
├── 03_react_core/            Components, props, state, one-way data flow, composition before global state
├── 04_hooks_and_lifecycle/   useState, useEffect, and why effects/cleanup exist
├── 05_team_site/             Lighter track: a static/simple React team site, needs only 01-04
└── README.md                 This file
```

## Suggested order

Work through `00` to `04` in order — `01_foundations`'s scouting form is the literal thing `02` ports into a real project, `03` rebuilds as React, and `04` adds state and lifecycle to. `05_team_site` only needs `01`–`04` and is a good stopping point if you're not continuing into `frontend_systems_primer` this cycle — it does not depend on anything past this folder.

## What this primer intentionally leaves out

- **Real data.** Every form in this primer holds data in memory and loses it on refresh, on purpose. Persisting anything past that — an API, a database, offline storage — is `frontend_systems_primer`'s job, not this one's.
- **Deployment.** This primer never leaves your laptop. Getting this app onto a real URL is `frontend_systems_primer/08_deployment`.

## Setup notes

- **`01_foundations`** needs nothing but a browser.
- **`02_why_typescript` onward** needs [Node.js](https://nodejs.org/) (LTS) and `npm`. See `../README.md` for the exact commands.
