# Local vs. Cloud vs. Edge

Most of the code you run likely runs on your own laptop, and your own laptop only. Maybe you open VSCode, run some scripts, look at the results. Most of the time, you probably weren't too worried about compute constraints. 

Here, that stops being true. We're going to dive into why people don't just run programs locally, or on your own computer/machine, but also in the cloud, or on an edge device. 

## Three Places Compute Can Happen

### Cloud 

The cloud is an umbrella term referring to a collection of servers that allow you to run programs outside of your own laptop. Some of the big players in cloud computing are Microsoft, Amazon, and Google, who make a lot of money offering up servers and other programs that you can use. 

Why use the cloud? It is very versatile and powerful, because you can rent far more compute than any single device you own (unless you run NVIDIA, maybe). However, this comes at a pretty heavy cost: you have to send data out and get a result, all of which costs time, money, and tends to be prone to new errors. You also have to have a steady internet connection in the first place, and your data will be leaving your laptop, which always presents a potential security risk. 

### Local 

Local is probably what you've been spending more time doing. You run code on your own laptop, also called a machine. You have physical acess to either a laptop or a desktop, and you don't need to worry about per-use costs or network access. 

Many of the notebooks you've looked at in this curriculum are able to be run entirely locally. 

The case to use it essentially runs opposite to the cloud: your data stays on your own machine, with constant access and no run costs, but you also get far less compute and available programs to help you build better code. 

### Edge 

Edge compute is a device that is also a physical device, like a local machine, but it is purpose-built and resource-constrained. Meaning, it is (usually) only available as extra computer power, without much of the pretty graphics or programs like texting. 

This is very helpful with running models, because you only want compute for the purpose of inference. However, these machines also have to communicate with the cloud or with another local machine, which creates more work in terms of maintenance. 

## Why is Local the Default? 

Because a laptop has enough spare compute, memory, and power, you hardly ever bump into a ceiling while training a small model or
running inference on one image. "Local" quietly became synonymous with "running it
costs nothing and has no constraints." That equation is only true because a laptop is
general-purpose and overprovisioned for the small jobs this curriculum has asked of it so far. This stops applying when we start dealing with other applications like large compute tasks, and robotics! 

## The Robot's "Local" Isn't a Laptop

The trained object detection model we just built on Roboflow needs to run somewhere on the robot, and the robot's own controller (the roboRIO or SystemCore) is right there, physically part of the robot. Surely, that counts as "local," so just run the model there, right? 

The problem is that the robot's controller is not a laptop with idle capacity waiting
around. It is already running the robot's real-time control loop on a strict timing budget
(WPILib's `TimedRobot` runs this loop by default every 20 ms; see
[WPILib: Scheduling Functions at Custom Frequencies](https://docs.wpilib.org/en/stable/docs/software/convenience-features/scheduling-functions.html)).
Asking that same controller to also run a full vision model competes directly with the loop that's keeping the robot's motors under control. General-purpose "local" compute, in the robot's case, was never actually available in the first place.

## Edge is not just Nearby

This is why edge computing exists as its own category rather than just being a third
name for "local." The distinguishing axis isn't physical proximity. An edge
accelerator is, in the network-hop sense, also "local", because there's no connectivity dependency necessary (although some do use it).

The distinguishing axis is that it has a specific purpose and is resource-constrained for that purpose. 

A laptop could run a detection model, but it could
just as easily be someone's essay-writing laptop the next minute. An edge accelerator, like the chip inside a Limelight that runs its neural detector pipeline (`frc_resources/02_limelight`),
for instance, does one job, within a fixed and much smaller power and compute budget,
and does essentially nothing else. Trading away that general-purpose flexibility is
exactly what buys back a predictable, low-latency, low-power footprint small enough to it on a robot instead of in a server room.

## Cloud, Briefly

Cloud's tradeoffs are perhaps a little more familiar: every request costs a round trip, which means both latency (waiting on
the network, not just the compute) and a hard dependency on connectivity. For a
competition robot specifically, that dependency is close to disqualifying on its own! Many venues have terrible Wi-Fi connection, nevermind the fact we already deal with connectivity constraints for our radio. A robot whose vision pipeline requires a cloud round trip is a robot that stops detecting anything the moment venue Wi-Fi hiccups. Add the ongoing per-use cost and the
fact that data leaves the device (a privacy/ownership question, not just a technical
one), and cloud inference is rarely the right fit for anything that has to run *during*
a match. (See [Cloudflare: What is edge computing?](https://www.cloudflare.com/learning/serverless/what-is-edge-computing/)
for a longer treatment of the latency/bandwidth mechanics behind this.)

## Putting the Three Together

```
                            Network dependency
┌─────────────┬──────────────────────┬──────────────────────┐
│             │ Required             │ None                 │
├─────────────┼──────────────────────┼──────────────────────┤
│ General-    │ CLOUD                │ LOCAL                │
│ purpose     │ (remote,             │ (yours, no           │
│             │  elastic)            │  net hop)            │
├─────────────┼──────────────────────┼──────────────────────┤
│ Purpose-    │                      │ EDGE                 │
│ built,      │ (not really a        │ (no net hop,         │
│ single-job  │  category here)      │  no general-purpose  │
│             │                      │  slack either)       │
└─────────────┴──────────────────────┴──────────────────────┘
```

The full table adds the third axis, the budget, that the diagram above has no
room for:

| | Network dependency | General-purpose or purpose-built | Typical compute/power budget |
|---|---|---|---|
| **Cloud** | Required every request | General-purpose (someone else's) | Effectively unlimited, rented |
| **Local** | None | General-purpose (yours) | Large, but not infinite |
| **Edge** | None | Purpose-built, usually single-job | Small and fixed by design |

Local and edge share "no network dependency", which is why it's easy to conflate them. Cloud and edge share "not a general-purpose device you sit down at" in different ways. Edge is the only one of the three that's both: no network hop, and no
general-purpose slack to fall back on. The next notebook, `01`, gets concrete about
what that fixed budget actually looks like in numbers.

## Resources

- [Cloudflare: What is edge computing?](https://www.cloudflare.com/learning/serverless/what-is-edge-computing/) -
  a vendor-neutral explainer of the latency/bandwidth reasoning behind moving compute
  toward the data source, referenced above.
- [WPILib: Scheduling Functions at Custom Frequencies](https://docs.wpilib.org/en/stable/docs/software/convenience-features/scheduling-functions.html) -
  confirms the 20 ms default `TimedRobot` loop period referenced above, and shows how
  tight that budget already is before adding any vision workload to it.
