# 18 - Onboarding and Mentorship

## Handing off a Codebase

`10_reading_unfamiliar_code` is written for the person walking into unfamiliar code cold. This module is for what an experienced team member can do, *before* they graduate or before a new member's first day.

## Leave a Map

The single most useful thing an experienced team member can do is writing down the answers *before* anyone has to ask, in a place a newcomer will actually find. Concretely, that means:

- A README that states the entry point, how to run the tests, and a one-paragraph overview of the subsystems. A rough box-and-arrow sketch is worth including alongside the prose, not instead of it.
- If you know a specific design decision that looks arbitrary but isn't — a magic number tuned from real testing, a workaround for a specific piece of hardware, an order-of-operations that matters for a non-obvious reason — write it down as a comment or a doc note *now*, while you still remember why. `10`'s Chesterton's Fence lesson ("don't tear down what you don't understand") only works if someone eventually finds out the reason.

See `04_documentation` for the details of what to put in each. 

## Structuring a First Task

"Read the whole codebase for a week, then let us know when you're ready" is a bad onboarding plan. A good first task instead is:

- **Small** — completable in a single sitting or session, not a multi-week slog with no visible progress.
- **Safe** — low blast radius; it doesn't touch a match-critical code path solo on day one.
- **Owned** — there's a specific person the new member can ask, not "figure it out from the docs."
- **Real** — it gets reviewed (`16_code_review`) and merged like any other change, so the new member's first contribution is an actual, finished thing, not a throwaway practice exercise that never ships.

Pairing (`17_pair_programming_and_workflow`) is the natural tool for exactly this moment. You have a navigator who already knows the codebase, sitting with a new driver on their very first real task.

## Answer `10`'s Questions before They're Asked

Concretely, as an experienced member, you should be able to answer `10_reading_unfamiliar_code`'s own orientation questions about your own codebase, unprompted. If you can't answer all of those about code you wrote or maintain without stopping to think hard, that's not a knowledge gap in the newcomer who hasn't joined yet, but rather that you have to improve documentation. 

## Putting it Together

Pick a real subsystem or module you (the current student) know well. This should be from an actual team codebase, not this instructional repo. Work through `exercises/exercise-1-write-the-map.md`: write the onboarding artifact `10`'s own questions imply someone will eventually need, then — if you can — actually hand it to a newer teammate and see whether it was enough. `exercises/exercise-2-pick-the-first-task.md` picks up the other half of this module — the Small/Safe/Owned/Real framework — against five candidate first tasks, some of which are good fits for very different reasons than the others fail.

## See also

- **`10_reading_unfamiliar_code`** — the newcomer's side of this same moment; read that module first, this one assumes it.
- **`04_documentation`** — what actually goes into the map you leave behind.
- **`17_pair_programming_and_workflow`** — pairing as the tool for someone's first real task.
- **`16_code_review`** — a new member's first task still gets reviewed like anyone else's, not waved through because it's their first one.
- **`19_postmortems_and_incident_review`** — the same "write it down while you still remember" discipline, applied to an incident instead of a fence-style design decision.

## Resources

- [Farnam Street: Chesterton's Fence](https://fs.blog/chestertons-fence/) — the same reasoning `10_reading_unfamiliar_code` uses from the newcomer's side; this module is about writing the reason down before someone has to rediscover it the hard way.
- [Wikipedia: Bus factor](https://en.wikipedia.org/wiki/Bus_factor) — the risk this whole module exists to reduce: how much knowledge is concentrated in how few people, and what happens to a project when one of them leaves.
