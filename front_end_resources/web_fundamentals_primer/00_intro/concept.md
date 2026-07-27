# 00 - Web Fundamentals: Learning to Build the Other Half of the Stack

`language_primer` taught you Java, Python, and C++ well enough to write a state machine, a hashmap, a training loop. None of that ever produced something you could hand a mentor and say "click around in this." This primer does. By the end of `04_hooks_and_lifecycle`, you'll have a real, running scouting app in a browser — one your team could plausibly use in a pit, once `frontend_systems_primer` wires in real data.

## Why TypeScript and React, specifically

TypeScript and React are the **vehicle** for this primer, not the point, the same way Java was the vehicle for learning command-based structure in `systems_primer` and not the point of that primer either. Every concept here — typed data, one-way data flow, component composition, effects and cleanup — is a general frontend idea that shows up in some form in every modern framework (Vue, Svelte, Angular) and in plenty of non-web UI toolkits besides. We picked TypeScript + React specifically because it's what you'll actually run into on a real team's stack or a real internship, not because the ideas only exist there.

## You already think this way

You're not starting from zero here, even though you've never touched React. A few direct lines from what you already know:

- **Static typing** (`language_primer/00_why_three_languages`, Java vs. Python) is exactly the discussion `02_why_typescript` picks back up, just with JavaScript standing in for Python this time.
- **Async/await** (`03_react_core` and beyond will use this constantly) is the exact same tool `01_concurrency_realtime_loops` in `systems_primer` used to reason about not blocking a robot's loop — here it's "don't block the browser's paint" instead of "don't block the 20ms periodic loop," same underlying shape.
- **Component state**, once you hit `04_hooks_and_lifecycle`, is going to look a lot like `03_state_machines`: a fixed set of named conditions, with defined events that move between them. React just calls the states "state" and the events "renders."

Whenever one of these connections shows up for real, this primer will call it out by name instead of assuming you'll notice on your own.

## What "mechanics" means here

Everything in this primer is about **making one screen do the right thing**: show the right markup, apply the right styles, respond correctly to a click or a keystroke, hold the right values in memory while the page is open. None of it is about where data comes from, what happens if the network drops, or how more than one person using this at once might step on each other — that's `frontend_systems_primer`'s entire subject, and it assumes this primer's app already exists and already looks and behaves correctly with fake, in-memory data before it touches any of that.

## What you'll build

One scouting form, built up in stages:

1. `01_foundations` — a plain HTML/CSS/JS version: real markup, real layout, a submit handler that validates input and renders entries into a list, entirely by hand, no framework.
2. `02_why_typescript` — the same form, ported into a real TypeScript project (`../scouting_app/`), with types on every piece of data it handles.
3. `03_react_core` — the same form again, rebuilt as React components — and a look at exactly which parts of `01`'s hand-written DOM code React is now doing for you.
4. `04_hooks_and_lifecycle` — the same form, now holding its data in real React state instead of a stray array, with `useEffect` doing the kind of setup/cleanup work `01`'s hand-rolled version never handled correctly.
5. `05_team_site` — a second, smaller site, if you want a lighter capstone for this folder alone.

Nothing here talks to a real network, a real database, or a real second user until `frontend_systems_primer` takes over. Start with `01_foundations/concept.md`.

## Resources

- [MDN Web Docs](https://developer.mozilla.org/en-US/) - the reference you'll come back to more than any other in this entire primer.
- [React: Thinking in React](https://react.dev/learn/thinking-in-react) - the official framing of "component" as a way of thinking, not just a syntax feature, that `03_react_core` builds on directly.
