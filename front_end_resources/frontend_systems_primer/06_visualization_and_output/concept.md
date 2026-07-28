# 06 - Visualization & Output: The Payoff

## The question `00_intro` opened with

`00_intro` framed this entire primer around three scouts, bad wifi, and data that can't be lost. Every topic since has been in service of getting entries captured and safely stored — real fields (`01`), real persistence (`02`), a real model of what a screen is doing (`03`), fast and error-resistant entry (`04`), and a way to survive the network actually failing (`05`). None of that was ever the point. `00_intro` said it directly: this is all in service of "turning a pile of entries into an actual pick-list, which is the entire reason any of this data collection exists in the first place." Every entry in `entries` has been sitting there since `02`, and until this topic, nothing has done anything with the pile beyond displaying it one card at a time, in the order it arrived.

## Same data, a genuinely different view

`EntryList`/`EntryCard` are still exactly what they were — a reverse-chronological feed, good for the job of "did my last entry actually save," which is what a scout mid-match needs. `EntriesTable.tsx` is a second, new view of the *identical* `entries` array, built for a completely different job: comparing entries against each other. A strategist deciding on alliance picks doesn't want a feed; they want to sort by team and read every note about team 1515 in a row, then sort by alliance and check for a pattern. Same prop, same data, two components, because "one glance at what just happened" and "compare everything" are different tasks that want different shapes — not because a table is a more advanced version of a card.

Sorting itself is a `sortKey`/`sortDirection` pair, one clicked `<th>` at a time:

```tsx
const sorted = [...entries].sort((a, b) => compare(a, b, sortKey) * (sortDirection === "asc" ? 1 : -1));
```

and `aria-sort` on the `<th>` itself — not the button inside it — is what makes a screen reader announce "Team, column header, sorted descending" instead of leaving that state visible only to whoever can see the little ▼. Same continuation as `04_ui_ux_principles`'s real `<input type="radio">` behind the alliance toggle: a real `<button>` inside the header cell gets keyboard activation for free, and `aria-sort` is the ARIA vocabulary that exists specifically for this exact widget.

## A chart earns its keep, or it doesn't get built

`TeamCoverageChart.tsx` answers one question: how many times has each team actually been scouted? That's a bar chart's whole job — turn a column of numbers into a column of lengths, because comparing lengths at a glance is faster than reading and comparing digits. It's also the entire chart this topic needed, built with a `<div>` per row and a CSS `width: {percentage}%` — no charting library. That's a deliberate call, not a shortcut: `general_programming_resources/05_dependency_management` frames "should this be a dependency at all" as a real judgment call every time, and a handful of horizontal bars is squarely on the "no" side of that line. A stacked, zoomable, animated chart library would be the right call for a very different chart than this one.

The bars themselves are `aria-hidden` — the real content lives in one `aria-label` on the container, a full sentence describing every row:

```tsx
aria-label={`Entries scouted per team: ${summary}`}
```

A `<div>`'s width carries no meaning to a screen reader; the label is what gives the whole chart a single, complete, accessible sentence instead of some number of decorative boxes. This is `04_ui_ux_principles`'s "the visual version and the accessible version don't have to be the same markup" idea, applied to a chart instead of a form control.

## The actual output: a ranked list, not a computed one

`PickList.tsx` is the thing every other topic in this primer exists to produce. It's deliberately *not* an auto-ranked leaderboard sorted by entry count — entry count measures how much a team has been scouted, not how good they are. Deciding that is a human judgment call, made by reading the notes; this component's only job is giving that judgment a place to live: an ordered list, reorderable with **"Move up" / "Move down" buttons**.

Buttons, not drag-and-drop — for the same reason `04_ui_ux_principles` used real radio inputs instead of a styled `<div onClick>`: a drag gesture has no keyboard equivalent at all. A button always does, disabled at the boundary you can't move past instead of a drag target that silently does nothing at the top of the list:

```tsx
<button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move team ${teamNumber} up`}>
```

Reconciliation stays simple on purpose. Entries only ever get added in this app, never removed, so a team that was ranked yesterday is still a real team today — the only thing that can happen to `order` is a newly-scouted team showing up that isn't in it yet:

```tsx
const missing = coverage.map((row) => row.teamNumber).filter((team) => !known.has(team));
if (missing.length === 0) return;
```

No filtering-out logic, because nothing in this app can currently make a team disappear. That's matching the code to what the system can actually do, not what a hypothetically fancier version of it might need to handle.

## What didn't get built here, on purpose

`PickList`'s order lives in `localStorage` — one device's working ranking, not shared team state. Making that list something every strategist's tablet stays in sync on, in real time, is a genuinely harder problem than this topic needed to solve — and it's exactly the problem `05_offline_and_multi_user` already built the tools for (a client-generated identity, an idempotent write, reconciliation against a server's copy). Wiring the pick list through Supabase instead of `localStorage`, the same way `entries` already is, is the natural next step for a team that actually wants this shared — left as a real extension, not something this topic builds, so this topic stays about visualization and not a repeat of `05`.

## Putting it together

```text
$ cd scouting_app
$ npm run dev
```

Submit a handful of entries across two or three different team numbers. In "Coverage," confirm each team's bar is proportional to how many entries you gave it. In "All entries," click each column header once, then again, and confirm the sort order and the ▲/▼ both flip. In "Pick list," use the up/down buttons to reorder a couple of teams, then refresh the page — the order should still be exactly what you left it as, the same `localStorage`-survives-a-refresh payoff `05_offline_and_multi_user` already established, applied to a different piece of state.

## Resources

- [MDN: aria-sort](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-sort) - the attribute driving the sortable table's screen-reader announcements.
- [MDN: aria-label](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) - the full-sentence alternative standing in for the coverage chart's decorative bars.
- [Nielsen Norman Group: Drag-and-Drop Interfaces](https://www.nngroup.com/articles/drag-drop/) - broader usability tradeoffs of drag-and-drop, beyond the keyboard-access argument this topic focused on.
