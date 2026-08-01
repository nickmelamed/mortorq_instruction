# 00 - Product Design: Deciding What To Build Before You Build It

`web_fundamentals_primer` and `frontend_systems_primer` both assume the screen you're building is already the right screen — that someone already decided a scout needs a big red/blue toggle instead of a dropdown, that the pick-list view should show EPA before comments, that the team site's homepage leads with the robot and not the roster. Those decisions didn't make themselves. This primer is where they get made, on purpose, instead of by whoever happened to be typing first.

That's the theme underneath every topic here: **a screen is a series of decisions, and "it felt right" is not a reason.** Every module in this primer replaces a gut call with a repeatable question — who is this for, what are they trying to do, what's the cheapest way to check the answer before committing code to it.

## What you'll produce

1. **User needs and problem framing** — a short, concrete needs statement for a real user of `scouting_app` or `team_site` (a pit scout, a strategist, a parent visiting the team site) — not a persona poster, a sentence you can test a design decision against.
2. **Prototyping, lo-fi to hi-fi** — a sketch, then a wireframe, of one screen or flow, raising fidelity only once the layer below it has stopped changing.
3. **Information architecture and user flow** — a map of the actual path a user takes through the app, start to finish, including the branches (what happens if the match number is wrong, if there's no network).
4. **Visual design fundamentals** — color, type, and spacing decisions for that same screen, each with a stated reason (contrast for legibility outdoors, a type scale for hierarchy) instead of a preference.
5. **Design systems** — those decisions turned into a small, real token/component set that `team_site` and `scouting_app` can both actually import and use.
6. **Evaluation and iteration** — a heuristic pass and a cheap usability check on the result, and what changes because of it.

## How this hands off to the other primers

This primer never touches code, and it doesn't need to run after the other two — it's meant to run alongside them. The natural order for any given piece of `scouting_app` or `team_site` is: frame the need (`01`), sketch and flow it (`02`–`03`), give it a real visual and system treatment (`04`–`05`), then hand the result to `web_fundamentals_primer` to build and `frontend_systems_primer` to wire up and harden. If you build first and design after, that's fine too — `06_evaluation_and_iteration` works just as well as a critique of something that already exists.

## How to work through this

Go in order — each topic's exercise produces the artifact the next topic works from. Read each `concept.md` before doing its exercise, same as every primer before this one.

## Resources

- [Nielsen Norman Group: The Definition of User Experience](https://www.nngroup.com/articles/definition-user-experience/) - a grounding read on what "UX" actually covers, referenced by name throughout this primer.
- [Don Norman, *The Design of Everyday Things*](https://www.nngroup.com/books/design-everyday-things-revised/) - the classic text behind "a screen is a series of decisions," worth reading in full if you only read one design book.
