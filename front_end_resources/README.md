# Front End Curriculum: Web Fundamentals, Frontend Systems, and Product Design

This curriculum assumes you've been through `back_end_resources` — `language_primer` for language fundamentals and `systems_primer` for backend systems thinking. It follows the same split, aimed at the other half of the stack:

- **`web_fundamentals_primer/`** — the mechanics. HTML, CSS, JavaScript, TypeScript, and React: the tools themselves. Mirrors `language_primer`'s job of teaching you to actually write the thing.
- **`frontend_systems_primer/`** — the systems thinking. Real data, state, offline/multi-user reliability, testing, deployment: the same kind of "what happens when this runs for real" questions `systems_primer` asks, aimed at a frontend instead of a robot.
- **`product_design_primer/`** — the design thinking, run in **parallel** with the two primers above rather than after them. User needs, prototyping, information architecture, visual design fundamentals, design systems, and evaluation — deciding what a screen should be, before or alongside writing the code that builds it. Product and user-centered design, not visual/social media design.

Start with `web_fundamentals_primer/00_intro/concept.md` (or `product_design_primer/00_intro/concept.md` if you're starting on the design side).

## The through-line project

All three primers work on **one app**: an FRC scouting app, pulling from real sources (The Blue Alliance, Statbotics) once `frontend_systems_primer` wires data in. `web_fundamentals_primer` builds its UI shell, form, and components; `frontend_systems_primer` assumes that shell exists and wires in real data, persistence, offline support, and deployment on top of the same codebase; `product_design_primer` works on the same app too, but never in code — its artifacts (needs statements, wireframes, flow maps, a design system) are meant to feed into what the other two primers build, not sit separately from it. There's a lighter parallel track — a team site, `team_site/`, built entirely in `web_fundamentals_primer/05_team_site` — for students who complete only `web_fundamentals_primer`; it's a second, independent project that doesn't feed into `frontend_systems_primer`.

The project isn't one static folder. It's a real, evolving codebase that starts as plain HTML/CSS/JS in `web_fundamentals_primer/01_foundations/` (no build tooling yet — you don't need any to write HTML/CSS/JS) and becomes a real `npm`-managed project, `scouting_app/`, from `web_fundamentals_primer/02_why_typescript/` onward, once there's an actual reason (a TypeScript compiler, then a dev server) to need one. Each module leaves `scouting_app/` in a working, runnable state, tagged in git: `module-web-01-start` / `module-web-01-done`, `module-web-02-start` / `-done`, and so on through `module-sys-08-done`. Check out a tag to see exactly what the app looked like at the start or end of any lesson:

```text
$ git checkout module-web-03-done
```

## Setup notes

- **`web_fundamentals_primer/01_foundations`** needs nothing but a browser — open `index.html` directly, or use an editor's built-in live-reload (e.g. VS Code's Live Server extension).
- **Everything from `02_why_typescript` onward** needs [Node.js](https://nodejs.org/) (LTS) and `npm`. `cd scouting_app && npm install && npm run dev` gets you a running dev server for the rest of both primers.
