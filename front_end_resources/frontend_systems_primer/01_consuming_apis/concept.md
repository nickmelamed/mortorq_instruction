# 01 - The Data Layer: Consuming APIs

## From `05_apis_networking`'s toy server to a real one

`systems_primer/05_apis_networking` gave you the shape of HTTP in miniature: a GET request, a JSON response, a status code, all running against a fake server in the same notebook process. `scouting_app/src/api/tba.ts` is that exact same shape — a GET request, a JSON response, status codes you branch on — against a real backend you don't control, can't modify, and that can fail in ways a toy server never will: rate limits, downtime, a typo'd URL, an expired key. Everything below is about handling that gap honestly instead of pretending it isn't there.

## Getting a real key

[The Blue Alliance](https://www.thebluealliance.com/apidocs) is the FRC community's central data source: every team, every match, every event, going back years, free to query. It requires a personal read key, though — not because the data is private, but so TBA can rate-limit and identify traffic. Get one:

1. Create a free account at [thebluealliance.com](https://www.thebluealliance.com/).
2. Go to your account page and find **Read API Keys**.
3. Add a new key (any description is fine) and copy it.
4. In `scouting_app/`, copy `.env.local.example` to `.env.local` and paste your key in as `VITE_TBA_AUTH_KEY`.

Vite only exposes environment variables prefixed `VITE_` to your app's code, and only reads `.env.local` at dev-server startup — restart `npm run dev` after creating or editing it. `.env.local` is already covered by `scouting_app/.gitignore`'s `*.local` rule, so your key never gets committed.

## `api/tba.ts`: a typed client for one real endpoint

`fetchEventTeams(eventKey, authKey)` does exactly one thing: given an event key like `"2024casj"`, it asks TBA for that event's team list and returns a typed `TbaTeam[]`. Everything past the `fetch()` call itself is handling a way it can fail:

- **No key at all** — checked before the request is even sent, with a message telling you exactly what to fix.
- **`401`** — the key exists but TBA rejected it.
- **`404`** — the event key doesn't exist.
- **A timeout** — `AbortController` bounds the request to 8 seconds, the exact defensive pattern `systems_primer/08_error_handling_fault_tolerance` described by hand ("never wait indefinitely for something that might not come back"), now actually implemented against a real network call instead of argued for in prose.
- **Anything else non-`ok`** — a generic fallback, since a real third-party API can fail in ways you didn't specifically plan for.

Every one of these throws a `TbaRequestError` with a message a scout (not just a developer) could read and act on. That last part matters: `error.message === "Failed to fetch"` tells a user nothing; `"No event found with key \"2024casj\". Event keys look like \"2024casj\""` tells them what to actually try next.

## Loading, error, and empty: not optional

`TeamLookup.tsx` renders one of four states, always, on purpose: **idle** (nothing requested yet), **loading**, **error**, or **success** — and success still checks `data.length === 0` separately, because "the request succeeded and there's genuinely nothing to show" is a real, distinct case from "the request is still in flight" or "the request failed." Skip the empty check and a scout at an event with a just-added, zero-team placeholder sees... nothing, with no explanation, indistinguishable from the page being broken.

This is the exact same three-state shape `systems_primer/08_error_handling_fault_tolerance` argued for generally — don't assume a value is present and valid, have a real plan for when it isn't — made concrete for a frontend specifically: a backend function can return early or log and move on when something's wrong; a frontend has to show the *user* something, in every one of those states, or they're left staring at a screen with no idea what's happening.

## CSV: the low-infrastructure fallback

Not every scouting workflow starts with an API. Plenty of teams start with a shared Google Sheet, and Google Sheets doesn't have a zero-setup public API the way TBA does — reading one for real means OAuth or a service account, genuine infrastructure this lesson isn't going to make you stand up for a light data-consuming module. `api/csv.ts`'s `parseTeamsCsv` is the realistic bridge instead: export your existing sheet as a CSV (`File -> Download -> Comma Separated Values`), paste it into `TeamLookup`'s second input, and it produces the exact same `TbaTeam[]` shape the TBA client does.

Notice that `TeamLookup.tsx` doesn't care which source produced its data — both paths just set the same `status` state to `{ status: "success", data: teams }`. That's worth sitting with: **the UI layer doesn't need to know or care where data came from**, only what shape it's in. This is the same separation `03_react_core` already established between a component's props and how those props got computed.

## A note on reliability, from actually building this

While building this lesson, [Statbotics](https://www.statbotics.io/) (the secondary data source mentioned in `00_intro`, and used in this module's exercises) was returning `503`s. That's not a hypothetical "APIs can go down" caveat — it's exactly what happened while writing real code against a real third-party service. Treat it as confirmation, not a footnote: the loading/error/empty handling above isn't defensive-programming theater, it's what actually kept this lesson's example working while a real dependency was unavailable.

## Putting it together

```text
$ cd scouting_app
$ npm install
$ npm run dev
```

With a real `VITE_TBA_AUTH_KEY` set, enter a real event key (any recent event's key works — event keys look like `2024casj`, findable on [TBA's event list](https://www.thebluealliance.com/events)) and click "Load from TBA." Try an invalid key or a nonsensical event key too, and confirm the error message actually tells you what's wrong. Then try the CSV path with a few pasted lines.

## Resources

- [The Blue Alliance API docs](https://www.thebluealliance.com/apidocs/v3) - the full v3 API reference; this module uses exactly one endpoint out of dozens available.
- [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) - the timeout mechanism `fetchEventTeams` uses, in full.
- [MDN: Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) - `fetch()`'s real API, beyond what `01_foundations`'s `fakeSubmitToServer` needed to touch on.
