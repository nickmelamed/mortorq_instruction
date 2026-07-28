# Exercise 1: Add Statbotics EPA

## Goal
Add a second, independent data source next to TBA, and make its failure gracefully degrade the feature instead of breaking it — real resilience, not just a second `fetch()` call.

## Background
[Statbotics](https://www.statbotics.io/) computes EPA (Expected Points Added), a single-number estimate of how strong a team's performance has been. Its API is public and needs no key at all: `GET https://api.statbotics.io/v3/team/{team_number}` returns a JSON object that includes an `epa` field. While this lesson was being written, that API was returning `503`s — genuinely unavailable, not a hypothetical. Build against that reality, not around it.

## Steps
1. Add `api/statbotics.ts`, following `api/tba.ts`'s shape: a typed function (`fetchTeamEpa(teamNumber: number): Promise<number>` or similar), a timeout via `AbortController`, and clear errors for a non-`ok` response.
2. In `TeamLookup.tsx`, after a team list loads successfully, fetch each visible team's EPA and show it next to their name in the dropdown (e.g. `"1515 — Mortorq (EPA 42.1)"`). Decide for yourself whether to fetch all of them eagerly or only on demand (e.g., when a team is selected) — either is defensible, but be able to explain the tradeoff you picked.
3. Critically: **one team's EPA failing to load must not break the rest of the list.** If Statbotics is down (likely, given the note above), every team should still show up and remain selectable, just without an EPA value attached.
4. Test this for real: since Statbotics may genuinely be down right now, confirm your code's failure path actually works, not just its success path.

## Self-Check
- [ ] The team dropdown still works completely even if every single EPA fetch fails
- [ ] A failed EPA fetch for one team doesn't prevent other teams' EPA from showing, if some succeed and some don't
- [ ] There's a clear visual difference between "EPA: 42.1" and "EPA unavailable" — not a blank space that looks like a bug
- [ ] `npx tsc --noEmit` passes

## Reflection
`fetchEventTeams` throwing stops the whole `TeamLookup` component from showing a team list at all — that's the right call, because without a team list the feature has nothing to show. Why is the right call different for a single team's EPA failing? What's actually different about how "critical" these two pieces of data are to the feature working at all?
