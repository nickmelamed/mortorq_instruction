# 01 - Concurrency and Real-Time Loops

## The 20-millisecond heartbeat

A WPILib robot doesn't run your code once. It runs it in a loop, over and over, roughly every 20 milliseconds, for the entire match. Every subsystem's `periodic()` method, every command's `execute()` method, all of it runs again on every single tick: read the joysticks, read the sensors, decide what to do, send output to the motors, repeat. This is the **periodic loop model**.

20 milliseconds is not a suggestion. WPILib expects each loop iteration to finish inside that window, tick after tick, for the whole match. If one iteration runs long, the *next* tick is late too. Joystick input gets read late, motor output gets sent late, and if it happens badly enough or often enough, WPILib will report **loop overruns**, and your robot will visibly stutter or become unresponsive. In the worst case, code that never returns control to the loop at all just freezes the robot outright, live, in the middle of a match.

## What "blocking" means, and why it's dangerous here

A **blocking call** is any operation that makes your code stop and wait before it can continue. Some common ones:

- `Thread.sleep(500)` — deliberately pausing for half a second.
- Reading from a slow or unresponsive network connection (say, waiting on a coprocessor that's momentarily busy).
- A loop with no fixed bound that keeps spinning until some condition becomes true, which might never happen if that condition depends on something that's now broken.

None of these are "wrong" in general-purpose software. A command-line tool blocking for half a second while it waits on a network call is completely normal. The problem is specifically the periodic loop: if any of these run *inside* a `periodic()` or `execute()` method, the entire robot loop waits right along with it. A single blocked sensor read can stall your drivetrain, your arm, and your intake all at once, because they all share the same loop.

`java/BlockingCallBug.java` demonstrates this directly: the same simulated loop as `java/PeriodicLoopDemo.java`, with one blocking call dropped into a single iteration, and comments showing exactly what changes in the timing as a result.

## Threads, briefly

A **thread** is an independent path of execution: a separate "worker" that can run code at the same time as everything else in your program, instead of waiting in line behind it. WPILib itself already uses threads under the hood to keep the periodic loop running on schedule; you generally don't need to create your own threads to write normal robot code, and command-based WPILib is deliberately designed so you rarely have to.

The reason threads come up at all in this topic is the danger, not the technique: the moment two threads can touch the same piece of data at the same time, you get a **race condition**, which is a bug where the outcome depends on the unpredictable timing of which thread happens to read or write first. A classic example: one thread reads a sensor value while another thread is in the middle of updating it, and the reading thread gets a value that's neither the old one nor the new one, just whatever partial state happened to be there at that instant. These bugs are notoriously hard to reproduce, because they depend on timing that varies from run to run — which is exactly why they're dangerous in a live match instead of just annoying in testing.

You do not need to learn locks or mutexes to get value out of this topic. The takeaway to carry forward is narrower and more practical: if you didn't deliberately start a thread, assume your code is running on the main periodic loop, and treat any operation that could take an unpredictable amount of time as a threat to every subsystem on the robot.

## The periodic loop model in real WPILib code

Everything above is described in the abstract on purpose, so it runs standalone with nothing but a JDK. In an actual FRC project, this loop isn't something you write yourself — it's `TimedRobot` (or, in command-based projects, which is nearly everyone, the `CommandScheduler` that `TimedRobot` drives). `TimedRobot` calls its registered periodic callbacks once every period (20ms by default) for the whole match; in command-based code, the callback it invokes each tick is `CommandScheduler.getInstance().run()`, which is what actually calls every `Subsystem`'s `periodic()` and every currently-scheduled `Command`'s `execute()`. Whatever you write inside one of those methods is exactly the `fakeSubsystemWork()` from the demos in this unit: running on the same shared loop, bound by the same 20ms budget, and just as capable of stalling every other subsystem if it blocks.

This is also where "loop overrun" stops being an abstract term: WPILib tracks tick timing with a `Watchdog`, and when a tick runs past its period, the `Watchdog` is what prints the overrun warning — often with a breakdown of which phase (command scheduling, `periodic()` calls, etc.) took too long. That warning is the real-world version of the `OVERRUN` line `BlockingCallBug.java` prints. If you ever need to run something on a genuinely separate schedule instead of piggybacking on the main loop (polling a sensor at a different rate, for instance), that's what a `Notifier` is for — but that's the exception, not the default; the default is that your code runs on the main loop, exactly as this unit assumes.

## Putting it together

`java/PeriodicLoopDemo.java` simulates the periodic loop itself — a fixed-rate `while` loop, no real robot hardware required — so you can see the timing model directly. `java/BlockingCallBug.java` takes that same loop and breaks it on purpose with a single blocking call, so you can see, in output you can actually read, what a stall looks like and why it happens. Run both; compare the printed tick timings.
