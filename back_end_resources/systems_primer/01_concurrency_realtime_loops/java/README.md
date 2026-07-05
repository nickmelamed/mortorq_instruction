# Running these demos

Read `../concept.md` first. Both files here are standalone Java files: no WPILib project, no build tool, just `javac`/`java` directly.

```text
$ javac PeriodicLoopDemo.java
$ java PeriodicLoopDemo
```

Every tick finishes in a few milliseconds and sleeps out the rest of the 20ms period, so ticks happen at a steady, predictable rate.

```text
$ javac BlockingCallBug.java
$ java BlockingCallBug
```

Identical loop, except tick 8 makes a call that blocks for 300ms. Compare the two outputs side by side: every tick before and after tick 8 in `BlockingCallBug` looks exactly like `PeriodicLoopDemo`'s output, but tick 8 itself blows straight through the 20ms budget and prints an `OVERRUN` line instead of a normal one. That's the entire lesson of this topic, made visible: one blocking call, one bad tick, and the whole loop — not just the slow part — pays for it.
