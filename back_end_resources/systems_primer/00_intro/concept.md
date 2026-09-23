# 00 - Backend Systems: Writing Code That Survives a Match

The `language_primer` taught you to write backend code. This primer assumes all of that and works to help you understand how code works together as a system. 

That's the theme underneath every topic in this primer: things fail live, you can't do anything about it during the match, and your only hope of figuring out is a post-mortem analysis after the match. 

1. **Concurrency & real-time loops** — your robot code runs inside a loop that ticks roughly every 20 milliseconds (assuming you use command-based systems like WPILib), for the whole match. Understanding what can and can't safely happen inside that loop is the single most important mental model in this primer.
   
2. **Communication & serialization** — a competition robot isn't one program. A roboRIO/SystemCore, a driver station, and sometimes a coprocessor all talk to each other constantly, and they need a shared format to agree on what they're saying.
   
3. **State machines** — most of what a robot does, like an autonomous routine, is naturally a sequence of named states and the events that move between them. Modeling it explicitly beats a tangle of booleans. Also, we discuss the contrast between this form of programming and the traditional command-based programming encouraged by WPILib. 
   
4. **Control loops (PID)** — the specific "read a sensor, decide, act" pattern that shows up anywhere a physical system needs to hit and hold a target, whether that's an arm angle or a drivetrain heading.
4b. **Motion control & trajectories** — the missing layer between "PID holds one setpoint" and "the robot follows a whole path across the field": motion profiling, Pure Pursuit, and the odometry both of those depend on.

5. **APIs & networking (light touch)** — a quick conceptual bridge to the frontend unit: how a dashboard or web tool would talk to a backend over HTTP. The deep networking material lives in its own unit; this is just enough to make that unit's starting point make sense.
   
6. **Testing & debugging** — how you gain confidence in code before it ever touches a field, since you don't get a mid-match do-over.
   
7. **Logging & observability** — the evidence you leave behind. When something goes wrong live, logs are frequently the only way you ever find out why.
   
8. **Error handling & fault tolerance** — what your code does the moment a sensor disconnects or a value comes back wrong, instead of crashing the whole robot over one bad reading.
   
9.  **Configuration & constants management** — keeping the numbers that differ between your practice bot and your competition bot (or between this year's robot and any tuning changes) in one place instead of scattered through your codebase.
    
10.  **Capstone** — one integrated scenario that wires several of the above together: a state machine driving a PID-controlled mechanism, guarded by fault-tolerant sensor reads, wrapped in structured logging, tuned through a practice-bot/comp-bot config. Everything above, as one system instead of nine separate ideas.

None of these topics are unique to robots. Every one of them is a real backend concern in web services, embedded systems, and distributed software generally. FRC just gives you an unusually sharp, unusually visible version of each: a live match with no pause button is a great way to notice why concurrency, error handling, and logging actually matter, instead of taking someone's word for it.

## How to work through this

Go in order. Topics `02` through `08` (including `04b`, which sits between `04` and `05`) lean on each other and on shared examples; the state machine you build in `03` shows back up, wired to a logger, in `07`. Topic `09` is standalone and can wait until last; `10_capstone` is meant to come after everything else, once each individual pattern is already familiar on its own. Most examples here are Java, because that's the language your robot code actually runs in. A few pull in C++ or Python where the concept genuinely lives there instead (serialization at the coprocessor boundary, a quick REST example). Read each `concept.md` before touching its code.

## Resources

- [What is WPILib?](https://docs.wpilib.org/en/latest/docs/software/what-is-wpilib.html) - the official orientation to the library every topic in this primer builds on.
- [How Complex Systems Fail](https://how.complexsystems.fail/) - Richard Cook's classic essay on why failures in complex systems happen, and why they're never one single cause. The mindset underneath this whole primer.
- [Google SRE Book: Table of Contents](https://sre.google/sre-book/table-of-contents/) - Google's own field guide to running production software reliably; the FRC version of this discipline is smaller in scope but the same in spirit.
