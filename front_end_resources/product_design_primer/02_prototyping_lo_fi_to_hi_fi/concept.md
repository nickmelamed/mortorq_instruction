# 02 - Prototyping, Lo-Fi to Hi-Fi: Spend Effort Where It's Cheap to Change

## The actual reason fidelity has an order

A sketch on paper takes two minutes and costs nothing to throw away. A polished, full-color mockup takes an hour and — this is the part that actually matters — once it exists, everyone looking at it, including you, starts treating the layout as decided, because it *looks* decided. If the structure underneath turns out to be wrong, you're not just redoing a sketch anymore; you're redoing an hour of work, and fighting the psychological pull to keep what already looks finished instead of fixing what's actually broken. Raising fidelity too early doesn't make a design better — it makes bad structure more expensive to notice and more expensive to fix. That's the entire reason lo-fi-to-hi-fi is a sequence and not a preference.

## Three stages, and what's deliberately missing from each

- **Sketch.** Boxes, arrows, labels — on paper or a whiteboard. No color, no real copy, often not even straight lines. Its only job is to answer "what's on this screen and roughly where," fast enough that you can draw three versions in the time it'd take to build one wireframe.
- **Wireframe.** Real proportions, real layout, actual labels and content — but grayscale, no type treatment, no color. This is where you settle *structure*: what's a button versus a link, what's above the fold, how many fields are on one screen versus split across two. Nothing here should be about how it looks yet.
- **Hi-fi.** Module `04`'s visual decisions — color, type, spacing — applied on top of a wireframe that has already survived scrutiny. This is close to what actually gets built, and it should be the last thing you produce, not the first.

The failure mode this guards against isn't "using the wrong tool" — it's picking colors and fonts for a layout that's about to get rearranged, and doing that work twice.

## Worked example: the pick-list screen

`frontend_systems_primer/06_visualization_and_output` eventually turns a pile of scouting entries into a pick-list — but nothing in the codebase builds that screen yet, which makes it a good target here: whatever you produce is a real input to a module that hasn't been written, not busywork on something already decided.

Start from a needs statement, the way `01` taught:

> A drive coach, in the ten minutes before alliance selection, needs to rank the top eight teams by a stat they trust, because picking wrong costs the whole event.

A sketch for this might be nothing more than: a list of eight boxes, each with a team number and one number next to it, and an up/down control. That's it — no attempt yet to decide if the stat is EPA, OPR, or something else, no color, no font. The wireframe stage is where you'd decide real things: is this list scrollable or does it need to fit one screen without scrolling (given the ten-minute constraint), does tapping a row expand more detail or navigate away, what happens if two teams tie.

## The five-minute test that catches expensive mistakes early

Before raising fidelity, show the sketch to one person who hasn't seen it and ask them to explain, out loud, what they think each part does and what would happen if they tapped it. Don't explain it to them first — if the sketch needs your narration to make sense, that's the finding. This takes five minutes and routinely surfaces the same category of problem a full usability test would (module `06` goes deeper on this), just cheaply enough to do it before anything is built.

## When to actually raise fidelity

Only once the layer below has been tested and stopped changing. If the sketch's structure changed after your five-minute test, sketch again — don't wireframe the old structure out of momentum. If the wireframe survived a walkthrough without a structural change, that's the signal to move to hi-fi, not a fixed amount of time spent or a deadline.

## Putting it together

Take a needs statement — your own from `01`, or the pick-list example above — and produce a sketch, then a wireframe, of the screen it implies. Run the five-minute walkthrough test on your sketch with one other person before you wireframe, and write down anything that changed as a result. Stop at the wireframe stage; hi-fi is `04`'s job, once there's an actual color and type system to apply.

## Resources

- [Nielsen Norman Group: Low vs. High-Fidelity Prototyping](https://www.nngroup.com/articles/low-vs-high-fidelity-prototyping/) - the cost/benefit tradeoff behind this module's ordering, in more depth.
- [Bill Buxton, *Sketching User Experiences*](https://www.billbuxton.com/sketching.html) - the foundational argument for why sketches and prototypes serve different purposes and shouldn't be conflated.
- [Nielsen Norman Group: Paper Prototyping](https://www.nngroup.com/articles/paper-prototyping/) - practical mechanics of running the kind of five-minute walkthrough test this module describes.
