# Compute Budgets and Accelerators

`00` established that edge compute means a fixed, small budget instead of a laptop's
effectively-unlimited slack. This notebook makes that budget concrete: what it's
actually measured in, what kind of chip you spend it on, and which choices you make
when building a model spend more or less of it.

## The Budget Has Three Parts, Not One

"How much compute do I have" is really three separate, simultaneous constraints, and a
design that satisfies one can still blow through another:

- **Throughput** - how many operations per second the chip can perform, most often
  quoted in **TOPS** (trillions of operations per second).
- **Latency** - how long a *single* inference takes, start to finish. This is not the
  same number as throughput: a chip can have enormous TOPS and still take too long to
  answer one question if that question doesn't parallelize well, or if it's waiting on
  something other than raw compute (more on this below).
- **Power / thermal** - how many watts the chip is allowed to draw and how much heat it
  can shed, both of which are hard limits on a battery-powered device with no fan the
  size of a desktop's.

A design has to fit inside all three at once. It's entirely possible to pick a model
that fits the throughput budget and still fails the latency budget, or fits both and
cooks itself on the power budget.

## Latency Budget: What "Fast Enough" Actually Means

`00` mentioned WPILib's `TimedRobot` running its control loop every 20 ms by default. A
vision pipeline doesn't have to hit that exact number, but it does have a real deadline
of its own: a camera feeding frames at, say, 30 frames per second is producing a new
frame roughly every 33 ms, and a detector that takes 200 ms per frame isn't giving you
"slow but correct" results - it's giving you results that are several frames stale by
the time they arrive, which is a real problem for anything trying to track a moving
game piece or another robot. The **latency budget** is this deadline: how long you
actually have per inference before the answer is too old to be useful. Everything else
in this notebook - which accelerator you pick, which hyperparameters you tune - is in
service of fitting inside that number.

## TOPS: Necessary, Not Sufficient

TOPS is the number every accelerator's spec sheet leads with, and it's worth
understanding both what it measures and why it isn't the whole story.

TOPS counts raw arithmetic throughput under ideal conditions - keep the chip's compute
units fed with data and it can perform that many trillions of operations per second.
The problem is the qualifier "keep it fed": a chip's compute units are useless if data
(model weights, intermediate activations) can't move in and out of them fast enough,
and that data movement is bounded by a completely different spec - **memory
bandwidth** - that the headline TOPS number says nothing about. A chip can double its
TOPS between generations and see almost no real-world improvement if memory bandwidth
barely moved, because the compute units spend more time waiting than computing (see
[TechnoLynx: TOPS Performance - What AI TOPS Scores Mean and When They Mislead](https://www.technolynx.com/post/tops-performance-ai-explained),
and the [*AI and Memory Wall*](https://arxiv.org/abs/2403.14123) paper for the general
argument that memory movement, not arithmetic, is increasingly the real bottleneck in
modern accelerator workloads). TOPS numbers are also usually quoted at a specific,
often minimal, numeric precision (commonly int8) - a spec sheet's TOPS figure and your
model's actual precision have to match for that number to mean anything, which is part
of why precision is one of the hyperparameters below rather than an afterthought.

The practical takeaway: TOPS is a useful first filter for "is this chip in the right
ballpark," but the number that actually matters - measured latency on your actual
model, on the actual chip - can't be predicted from a spec sheet. `03` comes back to
this directly: benchmarking on real target hardware isn't optional busywork, it's the
only way to get a number TOPS can't give you.

## The Accelerator Spectrum: Flexibility vs. Efficiency

Every option for running a neural network sits somewhere on a single spectrum: general-
purpose and flexible, or purpose-built and efficient. Moving right on this spectrum
trades away the ability to run arbitrary code for better performance-per-watt on
exactly the kind of math a neural network does (mostly matrix multiplication).

- **CPU** - fully general-purpose, runs anything, worst performance-per-watt for neural
  network math specifically, since none of its silicon is specialized for it.
- **GPU** - built for massively parallel arithmetic (originally for graphics, which is
  also mostly matrix math), a large step up in throughput for neural networks, still
  general-purpose enough to run other parallel workloads, still relatively power-hungry.
- **NPU / TPU / other ASIC** - silicon custom-designed specifically to run neural
  network operations and nothing else. Best performance-per-watt of the group, because
  every transistor is spent on the one job. The cost is flexibility: an ASIC is fixed
  once manufactured, and a workload that doesn't map well onto what it was designed for
  won't run well on it, if it can run at all.
- **FPGA** - reconfigurable logic that sits in between: you can reprogram its circuitry
  after manufacturing (unlike an ASIC), which buys back some flexibility at a cost in
  peak efficiency and (usually) in ease of development compared to just writing
  software for a CPU or GPU.

(See [Wikipedia: Neural processing unit](https://en.wikipedia.org/wiki/Neural_processing_unit)
for a broader survey of this taxonomy with more examples of each category.)

This spectrum, kept general on purpose, is the frame `frc_resources/02_limelight` and
`frc_resources/03_roboflow` are working within when they name specific chips (Google
Coral, Hailo-8) - those are concrete points on this same flexibility-vs-efficiency
line, not a different idea.

## Hyperparameters That Spend the Budget

Given a fixed chip and a fixed budget, several choices made *before* the model ever
reaches the accelerator determine how much of that budget a given inference actually
costs:

- **Batch size** - a cloud/server deployment can batch many requests together and
  process them as one larger, more efficient operation, because it can afford to wait
  a few milliseconds for enough requests to pile up. An edge device processing a live
  camera feed almost never has that luxury: frames arrive one at a time, and the
  detector has to answer on each one as it comes in. This is a real, structural
  difference from server-side inference, not just "less compute available" - it's a
  different operating regime (**batch size 1**) that some accelerators are better
  optimized for than others.
- **Input resolution** - a detector run on a smaller input image does less arithmetic
  per frame, trading some accuracy (small or distant objects become harder to resolve)
  for latency. This is a knob you'll see directly as `imgsz` in `perception_primer`'s
  object-detection notebook.
- **Model scale** - the same architecture typically ships in several sizes (e.g.
  YOLOv8n / s / m / l / x), trading capacity - and therefore accuracy - for compute
  cost. `perception_primer` specifically used the "nano" variant; that wasn't
  arbitrary, and this is the notebook where it stops being a mystery why.
- **Numeric precision** - the same model can run its arithmetic in 32-bit floats, 16-bit
  floats, or 8-bit integers. Lower precision means less data to move (helping the
  memory-bandwidth problem above) and often a large latency win, at some cost in
  accuracy. This is the single biggest lever of the four, and it's substantial enough
  to get its own hands-on treatment next, in `02`.

## Resources

- [TechnoLynx: TOPS Performance - What AI TOPS Scores Mean and When They Mislead](https://www.technolynx.com/post/tops-performance-ai-explained) -
  the TOPS/memory-bandwidth argument referenced above, in more depth.
- [*AI and Memory Wall*](https://arxiv.org/abs/2403.14123) - an accessible academic
  treatment of why memory movement, not raw arithmetic, increasingly dominates real
  accelerator performance.
- [Wikipedia: Neural processing unit](https://en.wikipedia.org/wiki/Neural_processing_unit) -
  a broader survey of the CPU/GPU/NPU/ASIC/FPGA landscape than this notebook covers.
- [WPILib: Scheduling Functions at Custom Frequencies](https://docs.wpilib.org/en/stable/docs/software/convenience-features/scheduling-functions.html) -
  the 20 ms control-loop figure this notebook's latency-budget discussion builds on,
  first introduced in `00`.

**Try It Yourself:** Pick any camera-based robot task from a past season (tracking a
game piece, aligning to a target). Given the frame rate of the camera used, compute the
latency budget per frame in milliseconds. Then find the published TOPS figure for two
different accelerators (any two - a phone's NPU and a desktop GPU both count) and
discuss: does a higher TOPS number by itself tell you whether that chip could hit your
computed latency budget? What else would you need to know to answer that for real?
