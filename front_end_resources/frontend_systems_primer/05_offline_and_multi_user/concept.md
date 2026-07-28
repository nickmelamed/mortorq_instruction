# 05 - Offline & Multi-User: The Payoff of This Primer's Whole Framing

## What's actually different starting here

Every topic so far handled a network failure by *reporting* it: `TeamLookup`'s fetch error, `ScoutingForm`'s `{ phase: "error", message }`, the "Could not load saved entries" banner in `App.tsx`. All correct, all honest about failure — and all of them, so far, have ended with the scout looking at an error message and trying again by hand. That was fine for a lookup or a page load. It stops being fine for the one thing this whole primer's `00_intro` was framed around: **a scout who just typed three sentences of notes, on a tablet, on wifi that's about to drop.** An error message doesn't help them. This topic is the app actually doing something about the failure instead of just naming it — which is why `00_intro` called this "the meaty module, and the direct payoff of this primer's whole framing."

## Detecting offline is a signal, not just a state

`App.tsx` now tracks `isOnline`, seeded from `navigator.onLine` and kept current by two browser events:

```ts
window.addEventListener("online", handleOnline);
window.addEventListener("offline", handleOffline);
```

This is the same "poll vs. push" distinction `systems_primer/01_concurrency_realtime_loops` drew for a robot's periodic loop, applied to the browser: nothing in this app checks connectivity on a timer. The browser already knows the instant its network state changes and pushes that fact as an event — the same shape as a WPILib button edge, just fired by the platform instead of a 20ms loop. `isOnline` drives a banner ("You're offline...") that's the honest version of what used to be silence: previously, a scout mid-submission with no wifi just watched the button say "Saving..." until a request timed out. Now the app tells them, up front, what's actually going to happen to what they type next.

## Optimistic ids: the client decides identity, not the server

Until now, an entry's `id` came from wherever it was actually saved — Supabase's `gen_random_uuid()` default (see `schema.sql`) on the real path, `crypto.randomUUID()` in the in-memory fallback. `api/scouting.ts`'s `saveEntry` now generates the id itself, up front, before attempting anything:

```ts
const withId: StoredEntry = { ...entry, id: crypto.randomUUID() };
```

That single line is what makes everything else in this topic possible. An entry has a real, permanent identity the instant a scout hits submit — not once a server gets around to acknowledging it. `EntryList` can render it immediately, `App` can hand it to the local queue below, and the entry that eventually lands in Supabase is *the same entry*, not a copy the server names something else.

## The local queue: small enough that localStorage is the right tool

When there's no connection (`!navigator.onLine`) or a request genuinely fails mid-flight, `saveEntry` doesn't throw — it hands the entry to `offline/pendingQueue.ts`, a flat JSON array kept in `localStorage`:

```ts
export function enqueuePendingEntry(entry: StoredEntry): void {
  writePendingEntries([...getPendingEntries(), entry]);
}
```

This is a deliberately small tool for a deliberately small job: a handful of entries, read and written whole, all at once. `localStorage`'s plain, synchronous `getItem`/`setItem`-a-string API is exactly suited to that and nothing more. [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) is the real answer once any of that stops being true — once you need to query by field instead of reading everything, once the data outgrows `localStorage`'s roughly 5MB ceiling, or once a big synchronous read/write would visibly block the page. None of that is this app's problem today, so this topic doesn't reach for it — but recognizing *when* that line gets crossed is the actual transferable skill, not memorizing either API.

## The conflict this app actually has to solve

"Conflict resolution" usually means whose edit wins when two people change the same thing — last-write-wins, merge, a human picking a side. That's not this app's problem, because this app never edits an existing entry; every scouting entry is a brand-new row, written once. The conflict here is smaller and sneakier: **at-least-once delivery.** A request can succeed on the server and still look like a failure to the browser — the response never arrives before the connection drops. `saveEntry` reasonably queues that entry (as far as the browser knows, it failed) and retries it later, with the *same* id from two sections up, since that id was generated once, up front, and never regenerated.

That stable id is exactly what turns a plain `insert()` into a trap instead of a fix. `entries.id` is a `uuid primary key` (`schema.sql`) — inserting a row whose id already exists doesn't silently create a duplicate, it fails outright with a primary-key-conflict error. And because `syncPendingEntries` can't tell "failed because we're still offline" apart from "failed because this already succeeded," that error just leaves the entry queued for the next retry, which fails the exact same way, forever. The visible result: a scout who did everything right watches "Pending sync" sit on an entry that's actually already sitting safely in Supabase — arguably worse than a duplicate, since nothing about the UI would ever tell you it's already saved.

The fix is one word in `api/supabase.ts`:

```ts
const { data, error } = await client
  .from("entries")
  .upsert({ id: entry.id, /* ... */ }, { onConflict: "id" })
  .select()
  .single();
```

`upsert` instead of `insert`, keyed on that same client-chosen id. A retry that lands on a row that's already there just updates it in place (with identical data, so nothing actually changes) instead of erroring — the write is *idempotent*: doing it once and doing it three times leave the database in the exact same state. This is a genuinely common pattern outside this app too; see Stripe's [Idempotent Requests](https://stripe.com/docs/api/idempotent_requests) for the same idea solving the same problem (a retried payment charge) in a completely different domain. It's also worth distinguishing from `systems_primer/08_error_handling_fault_tolerance`'s defensive patterns: that topic is about surviving a bad value *in the moment* (a stale sensor reading, a timeout) so the robot keeps running. This topic is about what happens *after* — reconciling two views of the world (this device's queue, the server's actual rows) once contact is re-established, which is a different problem and needs a different tool.

## The actual multi-user case: two devices, one queue each

`App.tsx`'s mount effect is where "multi-user" stops being abstract:

```ts
const fetchedIds = new Set(fetched.map((entry) => entry.id));
const stillPending = pending.filter((entry) => !fetchedIds.has(entry.id));
```

Picture two scouts on the same alliance, both losing signal in the same dead zone, both queuing entries locally. One's phone reconnects first and syncs. When the second one's connection comes back, its own queue is compared against what Supabase *actually* has — not blindly retried. If somehow the same entry already made it up (a sync that started before the drop, whose response the device never saw), it's removed from the local queue without a duplicate write, instead of assuming this device's copy is the only truth. That's the real content behind "multi-user" here: not merging two people's edits, but not stepping on work that already succeeded somewhere else.

## What `ScoutingForm.tsx` didn't have to change

Worth noticing directly: this entire topic — id generation, queuing, retry, reconciliation — lives in `api/scouting.ts`, `api/supabase.ts`, `offline/pendingQueue.ts`, and `App.tsx`. `ScoutingForm.tsx` still just calls `saveEntry(result.entry)` and hands whatever comes back to `onEntrySaved`, exactly as it has since `02_data_beyond_the_spreadsheet`. That's the payoff of `saveEntry`'s original one-job design: a caller that only ever needed "give me an entry, tell me what got saved" never had to learn a new interface just because what happens *behind* that interface got a lot more sophisticated.

## Putting it together

```text
$ cd scouting_app
$ npm run dev
```

With Supabase configured (see `02_data_beyond_the_spreadsheet/concept.md` if you haven't set that up yet): open your browser's dev tools, switch the Network tab to **Offline**, and submit two or three entries. Confirm each one appears immediately in the list with a "Pending sync" badge, and that the offline banner is showing. Switch Network back to **Online** and watch the badges disappear on their own within a couple of seconds, with no reload and nothing else clicked. Then reload the page *while still offline* with at least one entry queued, and confirm it's still there, badge and all — `localStorage` survived the refresh even though nothing reached Supabase yet.

## Resources

- [MDN: Window: online and offline events](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) - the exact events driving `isOnline` in `App.tsx`.
- [MDN: Window.navigator.onLine](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) - the synchronous read behind the initial `isOnline` state and the offline check inside `saveEntry`.
- [MDN: Window: localStorage property](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) - the storage behind `offline/pendingQueue.ts`.
- [MDN: IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) - the next step up once a local queue outgrows what `localStorage` is good at; not needed by this app today.
- [Supabase: upsert()](https://supabase.com/docs/reference/javascript/upsert) - the exact call `api/supabase.ts` uses to make a retried write land on the same row instead of creating a duplicate.
- [Stripe: Idempotent Requests](https://stripe.com/docs/api/idempotent_requests) - the same client-chosen-key idea solving the same at-least-once-delivery problem, in a domain where a duplicate write (charging a card twice) is a much worse outcome than here.
