# 03 - Information Architecture and User Flow: Mapping the Path, Not Just the Screen

## Two different questions that get conflated

"What screens exist and how are they organized" (information architecture) and "what path does a user actually take through them to finish one task" (user flow) are different questions, and a wireframe from `02` only answers the first, for one screen at a time. A pit scout doesn't experience `scouting_app` as an isolated wireframe — they experience a sequence: open the app, land on a form, fill it, hit a validation error, fix it, submit, land back at a blank form with focus already on team number. Design the screens without mapping that sequence and you get individually reasonable screens that don't add up to a coherent path — the seams between them are exactly where real users get stuck.

## Mapping a flow: boxes, arrows, and the branches you'd rather ignore

A flow map needs nothing fancier than boxes for states/screens and arrows for the actions that move between them — plus, critically, the branches: what happens when something doesn't go as planned. It's tempting to map only the happy path, because it's the one you already understand. The branches are where the actual design work is:

```text
[Blank form] --submit--> {valid?}
   {valid?} --yes--> [Saved] --auto--> [Blank form, focus on team #]
   {valid?} --no---> [Form with error shown] --fix & resubmit--> {valid?}

[Blank form] --submit, no network--> {queued or lost?}
```

That last branch isn't hypothetical — `frontend_systems_primer/05_offline_and_multi_user` exists specifically because a scout can lose network mid-match. You don't have to solve that branch here (that's a later primer's job), but if your flow map doesn't even *show* the branch, nobody downstream knows it needs solving. Mapping the branch is the deliverable; resolving it is someone else's module.

## Information architecture: the labeling problem

For something with more than one screen — `team_site` is the clearer case here — IA is about what pages exist, how they nest, and crucially, what they're *called*. "Our Robot" versus "2026 Season" versus "Robot Specs" aren't stylistic variants of the same label; they set different expectations about what a visitor will find there, and a mismatched label is a wrong turn a visitor takes silently, with no error message, because nothing told them they were wrong. Labels have to match how a real visitor would describe what they're looking for, not how the team internally refers to it.

The cheap way to check this is a **card sort**: write each page name on its own card, hand the stack to someone who isn't on the team, and ask them to group the cards and label the groups themselves, out loud. Where their grouping or naming differs from yours is exactly where your navigation will confuse a real visitor — and you'll have found that out with index cards, not with an analytics dashboard three months after launch.

## Putting it together

Map the full flow for submitting one `scouting_app` entry, start to finish, including at least two branches beyond the happy path (a validation error and one other — offline, a duplicate entry, whatever's realistic). Separately, do a small card sort for `team_site`'s navigation with one person who's never seen the current site: give them the current page names on cards, and write down where their grouping or labeling differs from what exists today.

## Resources

- [Nielsen Norman Group: Information Architecture 101](https://www.nngroup.com/articles/information-architecture-101/) - the foundational IA concepts (organization, labeling, navigation) referenced above.
- [Usability.gov: Card Sorting](https://www.usability.gov/how-to-and-tools/methods/card-sorting.html) - the mechanics of running a card sort, including open vs. closed variants.
- [Nielsen Norman Group: User Flows](https://www.nngroup.com/articles/user-flows/) - flow-mapping notation and common mistakes, beyond what this module covers.
