# 00 - Backend Systems: Writing Code That Survives a Match

The `language_primer` taught you to write code: variables, classes, data structures, a real three-language pipeline. This primer assumes all of that and works to help you understand how code works together as a system. 

That question matters more in FRC than in almost any other context you'll write software for. If your robot code hangs, throws an uncaught exception, or silently does the wrong thing thirty seconds into a match, you cannot pause the game, attach a debugger, and step through it. You get whatever your code does, live, in front of the judges and the other alliance, and you find out what actually happened afterward (if you logged it in the first place).

That's the theme underneath every topic in this primer: things fail live, you can't do anything about it during the match, and your only hope of figuring out is a post-mortem analysis after the match. 

1. **Concurrency & real-time loops** — your robot code runs inside a loop that ticks roughly every 20 milliseconds, forever, for the whole match. Understanding what can and can't safely happen inside that loop is the single most important mental model in this primer.
2. **Communication & serialization** — a competition robot isn't one program. A roboRIO, a driver station, and sometimes a coprocessor all talk to each other constantly, and they need a shared format to agree on what they're saying.
3. **State machines** — most of what a robot *does* (an autonomous routine, a game piece's path through the robot) is naturally a sequence of named states and the events that move between them. Modeling it explicitly beats a tangle of booleans. Also, we discuss the contrast between this form of programming and the traditional command-based programming encouraged by WPILib. 
4. **Control loops (PID)** — the specific "read a sensor, decide, act" pattern that shows up anywhere a physical system needs to hit and hold a target, whether that's an arm angle or a drivetrain heading.
5. **APIs & networking (light touch)** — a quick conceptual bridge to the frontend unit: how a dashboard or web tool would talk to a backend over HTTP. The deep networking material lives in its own unit; this is just enough to make that unit's starting point make sense.
6. **Testing & debugging** — how you gain confidence in code before it ever touches a field, since you don't get a mid-match do-over.
7. **Logging & observability** — the evidence you leave behind. When something goes wrong live, logs are frequently the only way you ever find out why.
8. **Error handling & fault tolerance** — what your code does the moment a sensor disconnects or a value comes back wrong, instead of crashing the whole robot over one bad reading.
9. **Configuration & constants management** — keeping the numbers that differ between your practice bot and your competition bot (or between this year's robot and any tuning changes) in one place instead of scattered through your codebase.

None of these topics are unique to robots. Every one of them is a real backend concern in web services, embedded systems, and distributed software generally. FRC just gives you an unusually sharp, unusually visible version of each: a live match with no pause button is a great way to notice why concurrency, error handling, and logging actually matter, instead of taking someone's word for it.

## How to work through this

Go in order. Topics `02` through `08` lean on each other and on shared examples — the state machine you build in `03` shows back up, wired to a logger, in `07`. Topic `09` is standalone and can wait until last. Most examples here are Java, because that's the language your robot code actually runs in; a few pull in C++ or Python where the concept genuinely lives there instead (serialization at the coprocessor boundary, a quick REST example). Read each `concept.md` before touching its code — the code is there to make the idea concrete, not to teach it from scratch.
