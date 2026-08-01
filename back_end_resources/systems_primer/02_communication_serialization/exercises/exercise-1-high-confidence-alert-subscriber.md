# Exercise 1: Add a High-Confidence Alert Subscriber

## Goal
Add a second subscriber to `NetworkTablesDemo.java`'s `MockNetworkTable` that only reacts when a detection is confident enough to act on — the same shape as a robot deciding "don't auto-align to a target unless we're sure it's real."

## Setup
Work in `02_communication_serialization/java/NetworkTablesDemo.java`. Compile/run with:
```text
$ javac NetworkTablesDemo.java
$ java NetworkTablesDemo
```

## Steps
1. Before changing anything, trace through the three `frames` in `main()` by hand and write down, for each frame, the `label` and `confidence` values that will be published.
2. Add a second listener to `detectorTable` (alongside the existing one) that only prints something when **both** of these are true for the value just published: the key is `"confidence"`, and the value is greater than `0.9`. Print a line like `[high-confidence alert] confidence=0.99 -- safe to act on this detection`.
3. Predict, from your step-1 trace, which frame(s) will trigger your new alert before running the modified file. Then run it and check.
4. `MockNetworkTable`'s listeners currently get called on **every** key's publish, not just `"confidence"` — that's why your listener has to check the key itself instead of just the value. Suppose a real robot's alert also needed to check `label` at the same instant (only alert for label `1`, not label `0`). Extend your listener to add that check too, and explain in one sentence why you can't reliably get both `label` and `confidence` from a single `publish()` callback the way `MockNetworkTable` is currently written (hint: look at what argument each `publish()` call passes to the listeners, and how many separate `publish()` calls one "frame" makes).

## Self-Check
- [ ] My prediction from step 3 matched the actual output, or I can explain exactly where my trace went wrong
- [ ] My high-confidence listener only fires on `"confidence"` publishes above `0.9`, not on every publish
- [ ] I can explain, using the actual `publish()` calls in `main()`, why one listener callback only ever sees one key/value pair at a time — never "the whole frame" at once

## Reflection
This is the real shape of a robot reacting to vision results without polling: subscribe once, then filter on whatever the callback receives, rather than asking "is there a new frame yet?" every tick. The gap you hit in step 4 — a listener only ever seeing one key at a time — is also a completely real NetworkTables gotcha: if you need several values from the *same* moment in time (confidence and label from the same detection, not a confidence from one frame paired accidentally with a label from the next), you generally need to either bundle them into one value (a single JSON string under one key, tying back to this topic's own serialization section) or track "have I seen both yet this cycle" yourself.
