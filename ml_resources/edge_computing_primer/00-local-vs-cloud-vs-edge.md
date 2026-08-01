# Local vs. Cloud vs. Edge

Every notebook up to this point in the curriculum ran the same way: open Jupyter on a
laptop, train something, run inference on it, look at the result. "Where does the
compute happen" was never a question worth asking, because the answer was always the
same and it was always free of any constraint that mattered. This primer is where that
stops being true - and the first step is noticing that "run it on my laptop" was a
choice, not the only option, and naming the other two.

## Three Places Compute Can Happen

- **Cloud** - compute runs on a remote server (or fleet of servers) you reach over a
  network. Elastic and powerful - you can rent far more compute than any single device
  you own - but every request pays a round trip: send data out, wait, get a result
  back. That round trip depends on having a network connection at all, costs money per
  use, and means your data physically leaves the device that collected it.
- **Local** - compute runs on a general-purpose device you have direct, physical access
  to: a laptop, a desktop. No network round trip, no per-use cost. Every notebook
  before this primer ran here.
- **Edge** - compute runs on a device that's also physically with you or attached to
  the system generating the data, but unlike a laptop, it's *purpose-built and
  resource-constrained* rather than general-purpose. It usually has one job (often just
  running inference on a single trained model) and a fixed, small budget of power,
  memory, and compute to do it in.

## Why "Local" Feels Like the Default

Notice that "local" and "cloud" differ along one axis: *is there a network hop between
you and the compute, or not.* That's the axis every prior notebook implicitly answered
- "not" - without ever making it a decision. Because a laptop has enough spare compute,
memory, and power that you never bump into a ceiling while training a small model or
running inference on one image, "local" quietly became synonymous with "running it
costs nothing and has no constraints." That equation is only true because a laptop is
general-purpose and overprovisioned for the small jobs this curriculum has asked of it
so far. It stops being true the moment "local" means something smaller.

## Where the Assumption Breaks: the Robot's "Local" Isn't a Laptop

Here's the naive move someone makes once they've internalized "just run it locally":
the trained detector needs to run somewhere on the robot, and the robot's own
controller (the roboRIO, or Systemcore going forward - see
`frc_resources/06_hardware_debugging` §5) is right there, physically part of the robot.
Surely that counts as "local," so just run the model there.

The problem is that the robot's controller is not a laptop with idle capacity waiting
around. It is already running the robot's real-time control loop - reading sensors,
running feedback controllers, computing motor outputs - on a strict timing budget
(WPILib's `TimedRobot` runs this loop by default every 20 ms; see
[WPILib: Scheduling Functions at Custom Frequencies](https://docs.wpilib.org/en/stable/docs/software/convenience-features/scheduling-functions.html)).
Asking that same controller to also run a full vision model competes directly with the
loop that's keeping the robot's motors under control - a delayed or dropped control
loop is a robot that stutters, or worse. "Just run it locally on the roboRIO" quietly
reintroduces the exact resource-constraint problem this primer exists to solve, wearing
a different name. General-purpose "local" compute, in the robot's case, was never
actually available in the first place.

## Edge: Purpose-Built, Not Just Nearby

This is why edge computing exists as its own category rather than just being a third
name for "local." The distinguishing axis isn't physical proximity - an edge
accelerator is, in the network-hop sense, also "local": no round trip, no connectivity
dependency. The distinguishing axis is **general-purpose-and-flexible vs.
purpose-built-and-constrained**. A laptop could run a detection model, but it could
just as easily be someone's essay-writing laptop the next minute - it has an operating
system, a user, and no fixed ceiling that matters at small scale. An edge accelerator -
the chip inside a Limelight that runs its neural detector pipeline (`frc_resources/02_limelight`),
for instance - does one job, within a fixed and much smaller power and compute budget,
and does essentially nothing else. Trading away that general-purpose flexibility is
exactly what buys back a predictable, low-latency, low-power footprint small enough to
sit on a robot instead of in a server room.

## Cloud, Briefly

Cloud's tradeoffs are the most familiar of the three, so they only need a short
treatment here: every request costs a round trip, which means both latency (waiting on
the network, not just the compute) and a hard dependency on connectivity. For a
competition robot specifically, that dependency is close to disqualifying on its own -
many venues have unreliable or no general internet access in the pits or on the field,
so a robot whose vision pipeline requires a cloud round trip is a robot that stops
detecting anything the moment venue Wi-Fi hiccups. Add the ongoing per-use cost and the
fact that data leaves the device (a privacy/ownership question, not just a technical
one), and cloud inference is rarely the right fit for anything that has to run *during*
a match. (See [Cloudflare: What is edge computing?](https://www.cloudflare.com/learning/serverless/what-is-edge-computing/)
for a longer treatment of the latency/bandwidth mechanics behind this.)

## Putting the Three Together

| | Network dependency | General-purpose or purpose-built | Typical compute/power budget |
|---|---|---|---|
| **Cloud** | Required every request | General-purpose (someone else's) | Effectively unlimited, rented |
| **Local** | None | General-purpose (yours) | Large, but not infinite |
| **Edge** | None | Purpose-built, usually single-job | Small and fixed by design |

Local and edge share "no network dependency" - that's why it's easy to conflate them.
Cloud and edge share "not a general-purpose device you sit down at" - in different
ways. Edge is the only one of the three that's both: no network hop, and no
general-purpose slack to fall back on. The next notebook, `01`, gets concrete about
what that fixed budget actually looks like in numbers.

## Resources

- [Cloudflare: What is edge computing?](https://www.cloudflare.com/learning/serverless/what-is-edge-computing/) -
  a vendor-neutral explainer of the latency/bandwidth reasoning behind moving compute
  toward the data source, referenced above.
- [WPILib: Scheduling Functions at Custom Frequencies](https://docs.wpilib.org/en/stable/docs/software/convenience-features/scheduling-functions.html) -
  confirms the 20 ms default `TimedRobot` loop period referenced above, and shows how
  tight that budget already is before adding any vision workload to it.
