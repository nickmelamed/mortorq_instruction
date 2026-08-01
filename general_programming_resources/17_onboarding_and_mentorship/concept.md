# 17 - Onboarding and Mentorship

## The other side of every fall's inherited codebase

`10_reading_unfamiliar_code` is written for the person walking into unfamiliar code cold — the student who inherits last season's codebase and has to orient themselves in it. This module is for the other half of that same moment: what a veteran can do, *before* they graduate or before a new member's first day, to make that walk shorter and safer for whoever comes next. Both halves are the same recurring event this curriculum keeps naming — someone has to hand knowledge off, and someone has to receive it — this module is the handing-off side.

## Leave a map, don't make people rediscover one

The single most useful thing a veteran can do isn't answering questions in the moment — it's writing down the answers *before* anyone has to ask, in a place a newcomer will actually find. Concretely, that means (see `04_documentation` for what belongs in each):

- A README that states the entry point, how to run the tests, and a one-paragraph overview of the subsystems — the exact things `10_reading_unfamiliar_code`'s orientation strategy has a newcomer hunt for by hand when nobody wrote them down.
- **Flag the fences before someone trips over them.** If you know a specific design decision that looks arbitrary but isn't — a magic number tuned from real testing, a workaround for a specific piece of hardware, an order-of-operations that matters for a non-obvious reason — write it down as a comment or a doc note *now*, while you still remember why. `10`'s Chesterton's Fence lesson ("don't tear down what you don't understand") only works if someone eventually finds out the reason. Leaving that reason undocumented doesn't protect the fence — it just makes it more likely someone rips it out by accident later, for lack of anywhere to have learned otherwise.

## Structuring a first real task

"Read the whole codebase for a week, then let us know when you're ready" is a bad onboarding plan, for the same reason `10_reading_unfamiliar_code` teaches searching for something specific over reading start to finish: a mental model built while chasing a real, concrete goal sticks better than one built from passive reading with no task attached. A good first task instead is:

- **Small** — completable in a single sitting or session, not a multi-week slog with no visible progress.
- **Safe** — low blast radius; it doesn't touch a match-critical code path solo on day one.
- **Owned** — there's a specific person the new member can ask, not "figure it out from the docs."
- **Real** — it gets reviewed (`15_code_review`) and merged like any other change, so the new member's first contribution is an actual, finished thing, not a throwaway practice exercise that never ships.

Pairing (`16_pair_programming_and_workflow`) is the natural tool for exactly this moment — a navigator who already knows the codebase, sitting with a new driver on their very first real task, catches the blind spots `10`'s orientation strategy warns about in real time, instead of after the fact in review.

## Answer `10`'s questions before someone has to ask them

Concretely, as a veteran, you should be able to answer `10_reading_unfamiliar_code`'s own orientation questions about your own codebase, unprompted: what's the entry point, what are the subsystems, which parts have real test coverage and which don't, and what's at least one Chesterton's-fence-style decision that would confuse a newcomer if it went undocumented. If you can't answer all of those about code you wrote or maintain without stopping to think hard, that's not a knowledge gap in the newcomer who hasn't joined yet — it's a signal that something needs writing down *now*, while you're still the person who can write it accurately, and before you're not around to explain it in person anymore.

## Putting it together

Pick a real subsystem or module you (the current student) know well — from an actual team codebase, not this instructional repo. Work through `exercises/exercise-1-write-the-map.md`: write the onboarding artifact `10`'s own questions imply someone will eventually need, then — if you can — actually hand it to a newer teammate and see whether it was enough.

## See also

- **`10_reading_unfamiliar_code`** — the newcomer's side of this same moment; read that module first, this one assumes it.
- **`04_documentation`** — what actually goes into the map you leave behind.
- **`16_pair_programming_and_workflow`** — pairing as the tool for someone's first real task.
- **`15_code_review`** — a new member's first task still gets reviewed like anyone else's, not waved through because it's their first one.

## Resources

- [Farnam Street: Chesterton's Fence](https://fs.blog/chestertons-fence/) — the same reasoning `10_reading_unfamiliar_code` uses from the newcomer's side; this module is about writing the reason down before someone has to rediscover it the hard way.
- [Wikipedia: Bus factor](https://en.wikipedia.org/wiki/Bus_factor) — the risk this whole module exists to reduce: how much knowledge is concentrated in how few people, and what happens to a project when one of them leaves.
