# 01 — FRC Intro

## 1. The General Idea

Two general concepts show up in almost every competitive robotics or esports format,
and FRC is built on both of them.

**Phased autonomy.** Any system that mixes pre-programmed behavior with human control
has to draw a line between "the machine decides" and "a person decides," and usually
runs them in separate phases rather than blending them constantly — it's easier to
build, easier to referee, and easier to watch. A phase where you trust a pre-written
routine completely, followed by a phase where a human takes over, is a common pattern
anywhere autonomy and teleoperation coexist (self-checkout, warehouse robots, drone
delivery final-mile handoff).

**Tournament structure: qualify, then eliminate.** Large competitive fields almost never
go straight to a single bracket — there's usually a qualification stage that seeds
or filters the field (round-robin, Swiss, ranked score), followed by a smaller
elimination stage. Team-based tournaments add a second wrinkle on top: sometimes your
teammates for the elimination stage aren't the people you trained with — they're
whoever you get matched or paired with once qualification ends.

## 2. What This Looks Like in FRC

A standard FRC match runs **2 minutes 30 seconds**, split into two phases:

- **Autonomous ("auto")** — the first **15 seconds**. Robots run pre-programmed code
  only; no driver input is allowed. Scoring during auto is usually worth more per
  action than the same action in teleop, specifically to reward teams that invest in
  autonomous code.
- **Teleop** — the remaining **2:15**, drivers control robots via the Driver Station.
  The last **~20-30 seconds** are typically designated as an **endgame** period with
  its own bonus scoring objective (a climb, a park, a hang) — exact timing and
  endgame task are defined by that year's game manual.

**Scoring paradigm varies year to year — this is deliberate, not incidental.** FIRST
designs a new game every season, and the scoring objective changes category
completely from year to year: some seasons are pick-and-place (score game pieces into
goals), some are shooter/cycle games (score projectiles rapid-fire), some are
defense-heavy (physically blocking or ramming opponents' robots is a legitimate
strategy). A team's whole robot architecture is a bet on what this year's paradigm
rewards.

**Alliance selection and elimination.** Qualification matches are 3-robot-alliance vs.
3-robot-alliance, but your qualification alliance partners are essentially random —
matches are scheduled so every team plays with and against a wide mix of others.
After qualification, the top-ranked teams become **alliance captains** and *draft*
their own 2-3 partner teams in an on-stage selection process, forming new alliances
that then play a single-elimination bracket. This means the team you're eliminating
opponents with in playoffs is a team you may have never been paired with in
qualification — you're evaluating and picking future teammates from what you saw them
do as opponents and strangers.

**The six-week build season.** From kickoff (when that year's game is revealed) to
the ship date, teams get roughly six weeks to design, build, wire, program, and test a
competition robot from scratch.

## 3. Where It Diverges From the General Case

The auto/teleop split isn't just "phased autonomy for its own sake" — it exists
because FIRST wants to reward two different skills (robust autonomous code *and* good
driving) in the same match, and because a fully-autonomous match would be a
programming competition, not a robotics-and-driving one. The 15-second window is short
enough that auto is usually a small number of pre-planned, high-confidence routines
rather than general-purpose autonomy — teams don't build robots that can improvise a
whole match's worth of untested autonomous behavior, because there isn't time in a
season (or in 15 seconds) to trust that.

Alliance selection diverges from typical tournament formats in a way that has real
strategic weight: because you draft partners *after* watching them as strangers or
opponents, scouting — systematically recording what other teams' robots can actually
do — becomes a core competitive skill, not a nice-to-have. A team that scouts well can
get drafted by a strong captain, or draft a genuinely complementary partner, purely
because their qualification performance was legible to other teams.

The **six-week build season is the constraint that shapes almost every other technical
decision covered elsewhere in this curriculum.** It's why simulation and offline
testing matter (there's no time to debug purely on real hardware — see
`05_wpilib`), why teams reach for an integrated tool like Limelight instead of
building a vision stack from scratch (see `02_limelight`), and why competition-day
debugging has to be a fast fixed process rather than open-ended exploration (see
`06_hardware_debugging`, §3). Every other module in this folder is, in some sense, a
tool built specifically to survive this deadline.

## Resources

- [FIRST Robotics Competition — Game & Season Materials](https://www.firstinspires.org/robotics/frc/game-and-season) — the official source for the current season's game manual, match format, and scoring rules; check this every season since specifics (match length, endgame task, scoring values) are redefined yearly.
- [FIRST Robotics Competition — Alliance Selection process](https://www.firstinspires.org/robotics/frc/blog/behind-the-model-alliance-selections) — FIRST's own explanation of how captains and draft order work.

**Check for understanding / hands-on exercise suggestions:**
- Have new students watch one full qualification match and one full playoff match from a recent season's competition archive, and write down every place the two matches felt different (crowd, strategy, robot behavior) — a good entry point into why alliance selection matters strategically.
- Walk through a past season's game manual scoring table as a group and identify: what's the auto-only bonus, what's the endgame task, and what does that season's scoring reward (speed? accuracy? defense?).
