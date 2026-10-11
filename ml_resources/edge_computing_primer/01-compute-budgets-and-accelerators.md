# Compute Budgets and Accelerators

`00` established that edge compute means a fixed, small budget instead of a laptop's
effectively-unlimited slack. This notebook tells us what that budget actually means

## A Budget in Three Parts

"How much compute do I have?" is usually a concern that ends with "my computer has 16GB RAM". But it is really three separate, simultaneous constraints, and a
design that satisfies one can still blow through another:

- **Throughput** - how many operations per second the chip can perform, most often
  quoted in **TOPS** (trillions of operations per second).
- **Latency** - how long a *single* inference takes, start to finish. A chip can have enormous TOPS and still take too long to answer one question if that question doesn't parallelize well, or if it's waiting on something other than raw compute (more on this below).
- **Power / thermal** - how many watts the chip is allowed to draw and how much heat it can shed, both of which are hard limits on a battery-powered device with no fan the size of a desktop's.

A design has to fit inside all three at once. It's entirely possible to pick a model
that fits the throughput budget and still fails the latency budget, or fits both and
cooks itself on the power budget.

## Latency Budget: What does "Fast Enough" Mean? 

`00` mentioned WPILib's `TimedRobot` running its control loop every 20 ms by default. A vision pipeline doesn't have to hit that exact number, but it does have a real deadline. Imagine a camera feeding frames at, say, 30 frames per second is producing a new frame roughly every 33 ms. A detector that takes 200 ms per frame is giving you stale information, which is simply not going to work when we're trying to do real-time object detection. The **latency budget** is this deadline. It tells us how long we actually have per inference before the answer is too old to be useful. Everything else in this notebook, like which accelerator you pick, which hyperparameters you tune, is in service of fitting inside that number.

## TOPS

TOPS is the number every accelerator's spec sheet leads with.

TOPS counts raw arithmetic throughput under "ideal conditions". If you keep the chip's compute units fed with data, it can probably perform that many trillions of operations per second.

The problem is the qualifier "keep it fed". A chip's compute units aren't very helpful if key data (model weights, intermediate activations) can't move in and out of them fast enough. 

Even more problematic is that data movement is bounded by a completely different spec, called **memory bandwidth**, that the headline TOPS number says nothing about. A chip can double its TOPS between generations and see almost no real-world improvement if memory bandwidth barely moved, because the compute units spend more time waiting than computing (see [TechnoLynx: TOPS Performance - What AI TOPS Scores Mean and When They Mislead](https://www.technolynx.com/post tops-performance-ai-explained),
and the [*AI and Memory Wall*](https://arxiv.org/abs/2403.14123) paper for the general argument that memory movement, not arithmetic, is increasingly the real bottleneck in modern accelerator workloads). TOPS numbers are also usually quoted at a specific numeric precision (commonly int8). **Numeric precision** is a measure of how many significant figures the data type can actually hold. Basically, think of it as how close the rounded version of the number is to the actual number. 

A spec sheet's TOPS figure and your model's actual precision have to match for that number to mean anything, which is part of why precision is something worth talking about. 

In summary, TOPS is a useful first filter for understanding if your chip is worth using but measured latency can't be predicted from a spec sheet. `03` comes back to
this directly.

## The Accelerator Spectrum: Flexibility vs. Efficiency

Every option for running a neural network sits somewhere on a spectrum ranging from general-purpose and flexible to purpose-built and efficient. Moving right on this spectrum trades away the ability to run arbitrary code for better performance-per-watt on the kind of math a neural network does (mostly matrix multiplication). FPGA sits third on that spectrum, not fourth; the diagram below places it by where it actually falls. The bullets underneath keep CPU/GPU/ASIC's more familiar order and cover FPGA last.

```
       CPU          →         GPU          →         FPGA         →    NPU / TPU / ASIC
(fully general-     →   (massively         →   (reconfigurable    →   (fixed once
 purpose, runs      →    parallel, still   →    after mfg;       →    manufactured;
 anything; worst   →    flexible enough   →    flexibility/      →    best perf/watt,
 perf/watt)         →    for other work)   →    efficiency mid)   →    zero flexibility)

GENERAL-PURPOSE, FLEXIBLE                                       PURPOSE-BUILT, EFFICIENT
```

### CPU 

A **Central Processing Unit**, or **CPU**, is the general-purpose brain of the computer. It can run anything, but that versatility comes at a cost. It has the worst performance-per-watt for the neural network math specifically, because none of it is specialized for it. 

### GPU 

**Graphical Processing Unit**, or **GPU**, was originally built for video rendering and graphics (hence the name). It is used commonly for neural network math because those same video and graphics applications are also mostly matrix math. It represents a strong step up from neural networks, but because it is still general-purpose enough to run other workloads in parallel (meaning at the same time), it still takes up a good amount of power. 

### NPU, TCU, and any other ASIC

**Application-Specific Integrated Circuit**, or **ASIC**, are silicon chips custom-built for specific tasks in AI/ML. Because they are designed for a singular category of tasks, they do have the best performance-per-watt, but at the cost of not being flexible with many other tasks. 

**Tensor Processing Unit**, or **TCU**, are built specifically for tensor operations. A tensor is a numerical representation that works very well for neural networks, which is why TPUs are great for tasks like AI training. Its why Google made them in the first place! 

**Neural Processing Unit**, or **NPU**, are similarly customized for running AI on consumer-type devices, like facial recognition. 

There are a ton of different categories of ASIC, the most important point is that you recognize that the more purpose-built something is, the more power-efficient it is. Versatility comes at a cost! 

### FPGA 

What if we don't want to give up that versatility? 

**Field Programmable Gate Array** or **FPGA**, helps us navigate this tradeoff. 

It is a special kind of hardware that allows for its logic gates to be reprogrammed after it is already manufactured. It does come at some efficiency cost, naturally, and also is typically harder to program in because you have to design custom circuits. 

See [Wikipedia: Neural processing unit](https://en.wikipedia.org/wiki/Neural_processing_unit)
for a broader survey of this taxonomy with more examples of each category.

Again, the point here is not to memorize different hardware names, but to understand the tradeoffs that come with our choices. 

## Hyperparameters That Spend the Budget

Let's assume you already have your chip, and your budget is set. There are several choices, or hyperparameters, that you can make that will dictate how much of the budget a given inference will cost even before the model ever reaches the accelerator. 

### Batch Size 
In the cloud, many requests can be processed as a single, more efficient operation, because the latency involved is not problematic. You can imagine that making 1000 users wait 2 seconds instead of 1 for a webpage to load is not the end of the world. 

However, for an edge device, where the detector has to be as close to real-time as possible, this isn't an option. Frames of video (or single images) come in one at a time, and they have to be processed as such. 

To highlight why this is an important tradeoff, if we had a batch size of 32, we can load model weights once and reuse them across 32 different inputs. This means our memory cost is spread across those different inputs, and our compute units are constantly being used. 

With batch size 1, the model weights are loaded once, and used on a single input, which means we are stuck waiting for enough memory to be available for that single input. 

Some accelerators are good at this, some aren't! Larger GPUs or server-class ASIC are designed around parallel processing and batches, so they will struggle. Edge NPUs and custom ASIC (like what we use for edge computing, Hailo-8), are designed with this constraint in mind. 

### Input Resolution 

Image resolution is how many pixels our image has. The more pixels, the larger the image matrix, which is helpful if we need a more detailed image. Many detectors are run on smaller input images because some of those details may not be as important, giving us a tradeoff of accuracy for smaller/more distant objects in exchange for less arithmetic and therefore faster processing. 

### Model Scale 

Many models have different sizes; YOLOv8 is what Roboflow works with, and it has n/s/m/l/x sizing (nano, small, medium, large, XL). The tradeoff here is that a larger model will have higher capacity via more parameters, and therefore accuracy, but at a higher compute cost. 

Our perception unit used the nano version for this cheaper cost. 

### Numeric Precision 

We mentioned earlier in this notebook that there are different ways to essentially round/represent numbers. Lower precision means less data to move, and while rounding a single number a few less decimal places might not seem like much, when you're working with millions of numbers, this actually turns into a large latency win. Of course, there is a real accuracy cost here, something we cover in the next notebook. 

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
