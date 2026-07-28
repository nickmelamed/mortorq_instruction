# 00 - Frontend Systems: Surviving Bad Wifi With Three Scouts and One App

`web_fundamentals_primer` taught you to build a screen that does the right thing: real markup, real components, real interactivity, a form that validates itself and holds its own state correctly. Every piece of data in it, though, has been fake — typed into a form, held in memory, gone the instant you refresh. This primer is about everything that changes once that stops being true: once the data is real, once more than one person is using the app at the same time, and once the venue wifi is doing what venue wifi always does at an FRC competition.

That's the theme underneath every topic here, the same way `systems_primer` built its entire backend primer around "things fail live, and you don't get a pause button." The frontend version of that sentence: **three scouts are entering data on three tablets, on a wifi network that's about to drop, and none of them can afford to lose what they just typed.** If a fetch call fails silently, if two scouts' entries overwrite each other, if the app just spins forever waiting on a request that's never coming back — none of that is a bug you get to fix later. It's a scout standing in a stand at Week 3 with a broken tool.

## What you'll build on top of `web_fundamentals_primer`

1. **Consuming APIs** — real match and team data from The Blue Alliance and Statbotics, instead of every field being typed by hand.
2. **Where data goes next** — a light look at persisting scouting data past a spreadsheet, and an even lighter look at turning scouting notes into LLM-assisted pick-list input.
3. **State as a systems problem** — the same state-machine thinking `systems_primer/03_state_machines` applied to an autonomous routine, applied here to "what states can this screen be in, and what triggers moving between them."
4. **UI/UX principles** — fast, error-resistant data entry under real time pressure, which is a genuine constraint here the same way a 20ms loop is a genuine constraint on the robot.
5. **The offline/multi-user problem** — the meaty module, and the direct payoff of this primer's whole framing: capturing data with no network at all, and reconciling it once the network comes back.
6. **Visualization & output** — turning a pile of entries into an actual pick-list, which is the entire reason any of this data collection exists in the first place.
7. **Testing** — the same "gain confidence before it touches a real match" philosophy as `systems_primer/06_testing_debugging`, aimed at components instead of a state machine.
8. **Deployment** — getting this off your laptop and onto a URL your team can actually use, with real depth on Vercel, git-triggered deploys, and preview environments.

## How to work through this

Go in order — each topic assumes the last. `scouting_app/` picks up exactly where `web_fundamentals_primer/04_hooks_and_lifecycle` left it: a real, working, in-memory-only form. By the end of `08_deployment`, it's a deployed, multi-user-safe, offline-tolerant app with real data in it. Read each `concept.md` before touching its code, same as every primer before this one.

## Resources

- [The Blue Alliance API docs](https://www.thebluealliance.com/apidocs) - the primary data source for this entire primer, referenced constantly starting in `01_consuming_apis`.
- [Statbotics API docs](https://statbotics.readthedocs.io/) - the secondary data source, used for advanced team statistics (EPA) alongside TBA's raw match/team data.
- [How Complex Systems Fail](https://how.complexsystems.fail/) - the same essay `systems_primer/00_intro` points to. Worth rereading here: everything it says about failures in complex systems applies just as much to a frontend with real users and a flaky network as it does to a competition robot.
