# 17 - Pair Programming and Lightweight Team Workflow

## Driver and Navigator

**Pair programming** is two people working on one piece of code at the same time, at one keyboard. The **driver** types and directly manipulates the code. The **navigator** doesn't touch the keyboard at all; they read ahead, ask questions, and catch mistakes the driver is too close to the code to see themselves. Swap roles regularly (every 15-30 minutes, or at each natural subtask) so both people get practice at both jobs, instead of one person permanently typing and the other permanently watching.

## When To Pair Up

Pairing costs roughly twice the person-hours of one person working alone, so it isn't free, and it isn't always the right call.

- **Worth it:** a bug nobody can reproduce or explain alone; onboarding a new or returning member onto an unfamiliar part of the codebase (a navigator watching over a driver's shoulder catches exactly the blind spots `10_reading_unfamiliar_code`'s orientation strategy warns about); a genuinely risky change, where a second set of eyes *before* it ships is cheaper than debugging it live in a pit.
- **Not worth it:** routine, well-understood, low-risk work one person can already do confidently and faster alone.

## Kanban vs. Sprints

Two common shapes for making a team's work visible:

- **Kanban** — a single, always-current board (commonly "To Do / In Progress / Done") showing every task and exactly where it stands right now, plus a **WIP (work-in-progress) limit** capping how many things any one person — or the whole team — is allowed to have "in progress" at once, so effort doesn't scatter across ten half-finished things simultaneously.
- **Sprints** — a fixed time-boxed period (commonly two weeks), with a planning meeting at the start (decide what fits in the sprint) and a review at the end (what got done, what didn't, and why). Many companies have weekly standup meetings as a way of intermediary review. 

A Kanban board in the middle of a build season might look like this:

| To Do | In Progress (WIP limit: 2) | Done |
|---|---|---|
| Vision: reduce false positives at range | Climber: re-torque bent bracket — Jordan | Drivetrain: tune turn PID gains |
| Scouting: add match schedule pull | Auto: fix leg-2 overshoot — Priya | Intake: current limit added |
| Pit: build spare battery cart *(blocked — waiting on the Climber card, left)* | | |

Notice what the WIP limit actually does here: three more cards are ready and waiting in "To Do," but "In Progress" stays capped at two, no matter how tempting it is for someone free to just start a third thing. That's the entire mechanism; it forces a card to actually finish (or get explicitly blocked, like the battery cart) before a new one starts, instead of everyone having five things "in progress" and nothing actually done.

FRC's six-week build season is already one hard external deadline that nobody on the team controls; stacking a second layer of internal fixed-length deadlines (sprint planning, sprint review) on top of that adds ceremony that competes for time a six-week season doesn't have much of. A single, always-current Kanban board — updated as things move, not re-planned every two weeks — usually gives a subteam the same visibility for a fraction of the overhead, which is why lighter-weight process tends to win here even though sprints are the more commonly taught default.

## Standups

A short, regular check-in. Commonly, three questions each: what did I do since we last talked, what am I doing next, what's blocking me. The purpose is to surface a blocker *before* it costs three days, not to make everyone narrate a to-do list.

## Definition of "Done"

"Done" isn't "the happy path worked once on my machine." Borrowing directly from this curriculum's own standards — `07_testing_philosophy` and `git_resources/CONTRIBUTING.md`'s PR checklist — done means tested, reviewed (`16_code_review`), and merged, not sitting uncommitted on one laptop because it mostly seems to work. A board is only trustworthy if everyone applies the same bar for moving a card to "Done"; the moment one person's "done enough" quietly becomes the team's actual standard, the board stops reflecting reality.

## Putting it Together

Pair up with a partner, ideally one you haven't worked with closely before, and use `general_programming_resources/10_reading_unfamiliar_code/examples/inherited_robot_code/` as your subject for the same small, undocumented project that module's own exercise uses. Work through `exercises/exercise-1-pair-on-inherited-code.md`, which has you answer that same exercise's orientation questions again, but as a driver/navigator pair, then compare what changed. `exercises/exercise-2-blockers-and-when-to-pair.md` picks up the two judgment calls this module names but the first exercise doesn't touch: telling a real blocker apart from status theater, and deciding whether a situation is actually worth pairing on in the first place.

## See also

- **`10_reading_unfamiliar_code`** — this module's exercise reuses that module's own example project directly; read `10` first if you haven't.
- **`16_code_review`** — review and pairing are two different points on the same "more than one set of eyes" spectrum: review happens after the fact on a finished diff; pairing happens live, while the code is still being written.
- **`07_testing_philosophy`** and **`git_resources/CONTRIBUTING.md`** — the "done" bar this module's definition-of-done section borrows directly.

## Resources

- [Martin Fowler: On Pair Programming](https://martinfowler.com/articles/on-pair-programming.html) — a widely-cited, thorough treatment of pairing, its real costs, and when it actually pays off.
- [Atlassian: Kanban vs. Scrum](https://www.atlassian.com/agile/project-management/kanban-vs-scrum) — a practical comparison of the two workflow shapes described above.
