# Exercise 3: Scroll the Table, Not the Page

## Goal
Confirm the real, unfixed responsive gap `concept.md` describes in `EntriesTable`, then fix it with the minimal real-world pattern for a table that has more columns than a narrow screen has room for.

## Steps
1. Run the app (`cd scouting_app && npm run dev`), submit a few entries so there's real data, and switch to the table view. At a normal desktop width, confirm all five columns (Team, Match, Alliance, Scouter, Notes) are readable and the sort buttons work.
2. Resize down to a narrow phone width (375px is a reasonable stand-in — use your browser dev tools' device toolbar rather than guessing). Describe exactly what happens to the table: does it shrink each column until the text wraps awkwardly, does it overflow the visible page width, or something else? Try to horizontally scroll *the page itself* — can you see the rest of the table that way, and if so, what else on the page moves with it that shouldn't?
3. In `components/EntriesTable.tsx`, wrap the `<table>` element in a `<div>` with a new class, e.g. `entries-table-scroll`. In `style.css`, give that class `overflow-x: auto` (and, optionally, `max-width: 100%`).
4. Refresh at the same narrow width and confirm: the table itself now scrolls horizontally, inside its own bounded box, while the rest of the page (the header, the form above it) stays put and doesn't move.
5. Compare this fix to `.alliance-toggle`'s `@media` breakpoint from `concept.md`. Why does a horizontally-scrolling container make more sense here than trying to make a 5-column table reflow into something narrower, the way the alliance buttons reflow into a column?

## Self-Check
- [ ] I described the actual broken behavior at 375px before making any change (crushed columns, page-level overflow, or both)
- [ ] My fix wraps the `<table>` in a container with `overflow-x: auto`, not a change to the table's own columns or the page's own overflow
- [ ] After my fix, only the table scrolls horizontally at narrow widths — the rest of the page does not move alongside it
- [ ] I can explain why a scrolling container fits this specific case better than a breakpoint-based reflow

## Reflection
A five-column data table doesn't have an obvious "narrower" version the way two alliance buttons do — you can't drop the Scouter column just because the screen got smaller, someone still needs that data. Letting the table scroll horizontally *inside its own bounded box*, instead of letting it push the whole page wider, is the standard answer to exactly this shape of problem: preserve every column, contain the overflow to the one element that actually has too much content, and leave everything else on the page unaffected. It's a smaller, more surgical fix than a breakpoint rewrite, and it's the same instinct behind never letting one wide code block or table blow out an entire page's layout, in a scouting app or anywhere else.
