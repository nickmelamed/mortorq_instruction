# 05 - Capstone: The Team Site

## A second project, on purpose

Every topic so far taught you something new about `scouting_app`. This one doesn't teach anything genuinely new — it hands you a second, independent project (`../team_site/`) and asks you to recognize the same shapes you already know: semantic HTML and layout from `01_foundations`, typed data from `02_why_typescript`, components and one-way data flow from `03_react_core`, a `useState` + `useEffect` pair from `04_hooks_and_lifecycle`. If `01`-`04` actually landed, this module should feel like *applying* a toolkit, not *learning* one. If it doesn't, that's useful information — go back to whichever of `01`-`04` feels shakiest before continuing.

This is also a legitimate stopping point. `team_site` doesn't depend on anything in `frontend_systems_primer`, and neither does the rest of `scouting_app` as it stands after `04`. If you're not continuing into the systems primer this cycle, you still walk away with two working, real pieces of software.

## The one genuinely new idea: content as data

There is exactly one pattern here that `scouting_app` only used in passing: `team_site/src/data.ts` holds every real piece of content on the site — sponsors, roster members, nav labels, the team's mission statement — as plain typed arrays and objects, completely separate from any component. Every component that displays content **reads from `data.ts` and maps over it**, instead of having that content hardcoded into its own JSX. `Sponsors.tsx` doesn't know three specific sponsor names; it knows how to render *however many* `Sponsor` objects `data.ts` currently has.

This is worth naming explicitly because it's the same shape `EntryList.tsx` in `scouting_app` used for a list that changes at runtime (`entries.map(...)`), now applied to content that's fixed at build time instead. The lesson generalizes: **whenever you're tempted to copy-paste a chunk of JSX with slightly different text three or four times, that's a sign the content should be data, and the JSX should be a component that maps over it once.** Update your team's real sponsors, roster, or mission statement by editing `data.ts` alone — no component needs to change.

## What's deliberately not here

There's no router library. Four sections and no need for shareable per-section URLs meant `activeSection` living in `App`'s state (exactly the pattern `scouting_app/src/App.tsx` already uses for `entries`) was simpler than adding a new dependency and a new concept neither `01`-`04` covered. If your team's real site grows past this — real URLs per page, a blog, dynamically loaded content — that's the point where reaching for a router stops being overkill; it's just past this primer's scope.

## Putting it together

```text
$ cd team_site
$ npm install
$ npm run dev
```

Click through all four sections and confirm the browser tab's title updates each time — the same `useEffect` pattern as `scouting_app`, applied here to nav state instead of an entry count. Then open `src/data.ts` and replace every placeholder value with your actual team's real sponsors, roster, and contact information — a team site with fake sponsor names isn't a finished team site.

## Resources

- [React: Thinking in React](https://react.dev/learn/thinking-in-react) - specifically its early step of identifying what should be a component vs. what should just be data your components render, which is the entire idea `data.ts` puts into practice here.
