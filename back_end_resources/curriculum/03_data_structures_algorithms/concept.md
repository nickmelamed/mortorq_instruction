# 03 - Data Structures: Stacks, Queues, Hashmaps, and Big-O

Every one of the "collections" mentioned briefly back in `01_basics` — a list of sensor readings, an array of motors — is really just one specific way of organizing a group of values. Which way you pick changes what operations are fast and what operations are slow. This topic covers three of the most common organizing patterns, and the vocabulary (Big-O) for talking precisely about "fast" and "slow" in the first place.

The running example: a diagnostics system tracking three things about a robot during a match — recent controller faults, a queued sequence of autonomous actions, and a lookup table from CAN bus IDs to human-readable device names.

## Stacks: Last In, First Out (LIFO)

A **stack** only lets you interact with one end of a collection: you can **push** a new value onto the top, or **pop** the most-recently-pushed value back off. Whatever went on last comes off first — Last In, First Out.

This fits our fault list well: when a motor controller reports a fault, you push a description of it onto a fault stack. When the driver station displays "most recent fault," it's popping (or just peeking at) the top of that stack — the most recent one is always sitting right there, without searching through everything that happened before it. You'd reach for a stack any time "most recent first" is the natural order you want, including things like an undo history or tracking how deeply nested your currently-running command groups are.

## Queues: First In, First Out (FIFO)

A **queue** also restricts you to the two ends of a collection, but the other direction: you **enqueue** (add) at the back and **dequeue** (remove) from the front. Whatever went in first comes out first — First In, First Out.

This fits a sequence of autonomous actions: "drive forward, then intake, then shoot, then drive back" needs to run in exactly the order it was queued, not the reverse. You enqueue each action as it's planned, and a loop dequeues and executes them one at a time, in order. Any time order-of-arrival needs to be preserved — a queue of vision detections to process, a queue of log messages to write out — a queue is the right shape.

## Hashmaps (a.k.a. dictionaries): Lookup by Key

A **hashmap** stores **key-value pairs** and is built to answer one question extremely fast: "given this key, what's the value?" Instead of a numeric position (like an array index), you look things up by whatever key makes sense for your problem — a CAN bus ID, a subsystem name, a button number.

For our diagnostics example: instead of storing device names in a plain list and scanning through it every time you need to translate a CAN ID into a readable name, you store them in a hashmap keyed by CAN ID. Handed an ID, the hashmap goes almost straight to the matching name — it doesn't have to check every other entry first the way a plain list scan would.

## Big-O: How "fast" and "slow" get made precise

**Big-O notation** describes how the *cost* of an operation grows as the *amount of data* grows — not how many milliseconds it takes on one specific machine, but the underlying shape of the growth. You'll see two shapes constantly:

- **O(1) — constant time.** The cost doesn't depend on how much data there is. A hashmap lookup by key is (on average) O(1): whether you have 5 entries or 5,000, finding the one you want takes roughly the same amount of work.
- **O(n) — linear time.** The cost grows in direct proportion to the amount of data, where *n* is the number of items. Scanning a plain list from the front until you find a matching CAN ID is O(n): in the worst case, you check every single entry, and doubling the list roughly doubles the worst-case work.

This is exactly why the hashmap wins for the CAN ID lookup: the same task, "find the entry matching this ID," costs O(1) on average with a hashmap versus O(n) with a plain list scan. On most software this difference is invisible. On a robot, it isn't automatically invisible — your control loop runs on a fixed schedule (WPILib's default is every 20 milliseconds), and every one of those 20-millisecond windows has to fit *all* of your robot's logic, including any lookups. An O(n) scan that's fast enough today can quietly become your bottleneck the moment a list it depends on grows, while an O(1) hashmap lookup doesn't care how large the map gets.

Big-O isn't about memorizing which structure is "best" — it's the tool for asking "will this scale if the input grows?" before it becomes a real problem on the field.

## Putting it together

`java.ipynb` and `python.ipynb` build this exact fault-stack / action-queue / CAN-ID-lookup trio using each language's built-in collection types, plus a small side-by-side demo comparing a linear scan against a hashmap lookup as the amount of data grows. `cpp/dsa.h` and `cpp/dsa.cpp` build the same three structures — and for the stack specifically, build it from scratch as a linked list of nodes connected by pointers, which is exactly the pointer and reference material from `02_oop_inheritance` put to real, practical use for the first time.
