# 06 — Hardware Debugging: CAN Bus, Phoenix Tuner X, REV Hardware Client

## 1. The General Idea

A **CAN (Controller Area Network) bus** is a shared, multi-drop electrical bus: every
device — motor controller, sensor, power distribution board — connects to the same two
wires (CAN-H and CAN-L) instead of each device getting its own dedicated wire back to the
controller. Every message a device sends carries an ID and goes out to *every* other
device on the bus; each device just ignores messages that aren't addressed to it.
Multiple devices can even try to send at once — CAN resolves this through bitwise
arbitration, where the message with the lowest numeric ID wins and the others
automatically retry, so nothing is lost.

Distributed control systems use a shared bus like this instead of point-to-point wiring
for one reason: **wiring scales with devices, not with connections.** A robot with 15
motor controllers on point-to-point wiring needs 15 separate signal runs back to a
central brain. On a bus, every device taps into the same two wires, so adding a 16th
device means running one more short stub, not rewiring the robot. The tradeoff is that
you now have to think about the bus as a shared resource — device IDs must be unique,
and a badly-behaved node can degrade the whole network, not just itself.

This gives a general framework for debugging *any* networked embedded system, CAN or
otherwise, that generalizes past FRC:

1. **Wiring problem** — is the physical layer intact? (continuity, connector seating,
   termination resistance, voltage present)
2. **Firmware problem** — is the device itself alive and configured correctly,
   independent of what any program tells it to do? (correct ID, correct firmware
   version, device reports faults on its own)
3. **Code problem** — is the controlling program sending the right commands, to the
   right ID, at the right time?

The order matters: check wiring first, because a wiring fault will make firmware and
code look broken too, and you'll waste time debugging software that was never the
problem.

## 2. What This Looks Like in FRC

FRC robots run their motor controllers, encoders, and IMUs on a CAN bus, with the
roboRIO (or, starting soon, Systemcore — see §5 below) as one node among many rather than
a central hub each device wires to individually. Two hardware vendors dominate, and most
teams run both on the same bus.

### CTRE hardware + Phoenix Tuner X

CTRE's CAN devices — **Talon FX** (the controller built into Falcon 500 / Kraken X60 /
Kraken X44 motors), **CANcoder** (absolute rotational position sensor), and **Pigeon 2**
(IMU) — are configured and debugged with **Phoenix Tuner X** (current as of the 2026
season; it replaced the original "Phoenix Tuner" desktop app and runs on Windows,
macOS, Android, and iOS).

A worked example — a typical swerve drivetrain's device list as it appears in Tuner X's
device scan:

| Device | Type | CAN ID | Bus |
|---|---|---|---|
| Front-left drive | Talon FX | 1 | rio |
| Front-left steer | Talon FX | 2 | rio |
| Front-left encoder | CANcoder | 3 | rio |
| Front-right drive | Talon FX | 4 | rio |
| Front-right steer | Talon FX | 5 | rio |
| Front-right encoder | CANcoder | 6 | rio |
| ...(back-left, back-right follow the same pattern, IDs 7-12) | | | |
| Gyro | Pigeon 2 | 13 | rio |

What Tuner X actually does with this list, day to day:

- **Device IDs** — every device must have a unique ID on its bus; Tuner X can rename and
  re-ID devices without touching code.
- **Firmware updates** — CTRE ships firmware updates alongside each Phoenix software
  release; Tuner X pushes them device-by-device or to the whole bus at once.
- **Live signal plotting** — graph a device's live output (motor current, encoder
  position, applied voltage) in real time, which is usually faster than adding a
  `SmartDashboard.putNumber` call and redeploying code just to see one value.
- **Self-test** — each device reports its own fault flags (e.g. "hardware fault,"
  "undervoltage," "boot during enable") independent of what the robot code is doing,
  which is exactly the "firmware problem" checkpoint in the general framework above.

### REV hardware + REV Hardware Client

Most teams don't run an all-CTRE or all-REV drivetrain — a common setup is **REV Spark
Max** controllers driving **NEO** motors for some mechanisms (often the drivetrain or
intake) alongside CTRE devices elsewhere on the same robot. **REV Hardware Client**
(current as of the 2026 season; REVLib 2026+ requires REV Hardware Client 2) is REV's
parallel tool to Tuner X — separate application, separate device list, same underlying
job: assign CAN IDs, flash firmware, and read live telemetry for REV devices. A SPARK MAX
running firmware 1.5.0+ can even act as a USB-to-CAN bridge, letting you configure and
update every REV device on the bus through one USB-connected controller.

The practical consequence: debugging a mixed drivetrain means checking **two** tools,
not one — a device that looks fine in Tuner X might be a REV device you can't even see
from there.

### Worked example: brownout / current-draw diagnosis

A brownout is what happens when total current draw pulls battery voltage below the
threshold the roboRIO needs to stay running — the classic symptom is the whole robot
browning out (motors cut, then everything reboots) during a hard acceleration or a
stalled mechanism. This is where "wiring vs. firmware vs. code" gets applied to a real
failure:

1. Pull the match log or the live PDP/PDH (Power Distribution Panel/Hub) current
   readout. Suppose you see total current spike to 180A for ~0.3s right as the robot
   brownouts, concentrated on two channels feeding the drivetrain.
2. **Wiring check** — is that current spike expected, or is a channel drawing far more
   than its motor should (a sign of a shorted or mechanically-jammed motor)? A NEO or
   Falcon under normal load draws tens of amps, not 180A on one channel; if one channel
   is drawing wildly more than its siblings, suspect a jam or short before touching code.
3. **Firmware check** — in Tuner X or REV Hardware Client, check that device's own fault
   log. A device that browns out and reboots mid-match will show a "reset while enabled"
   or undervoltage fault in its own history, confirming the power event reached the
   device itself.
4. **Code check** — only after wiring and firmware look clean do you look at whether the
   robot code is asking for more current than the mechanism needs (e.g. current limits
   not set on a climber or intake motor that can stall against a hard stop).

Current limiting in software (setting a supply/stator current limit on the Talon FX or
Spark Max config) is a code-layer fix — but it only makes sense to reach for *after*
you've confirmed the spike isn't a wiring fault masquerading as a tuning problem.

### CANivore / CAN FD

A standard roboRIO CAN bus can bottleneck on very device-heavy robots (many swerve
modules, extra sensors). **CANivore** (CTRE's CAN FD adapter, current as of the 2026
season) adds a second, higher-bandwidth CAN FD bus that some devices can be moved onto,
separate from the roboRIO's native bus — useful mainly for higher device counts where
message traffic on the native bus becomes the bottleneck, not something most teams need
on a standard 4-module swerve.

## 3. Where It Diverges From the General Case

The general debugging framework in §1 (wiring → firmware → code) is open-ended: in a lab
setting, you'd take as long as you need, swap components to isolate the fault, and
consult full documentation. **FRC debugging happens under constraints that make
open-ended troubleshooting a bad plan:**

- **Pit time is short.** Between matches you typically have a matter of minutes, not
  hours, to find and fix a problem before your next match starts.
- **Some venues have no usable internet** in the pits — you can't count on searching a
  forum for your exact error mid-competition.
- **You're debugging cold**, often under a crowd, often with a match clock already
  running down.

Because of this, the FRC-specific skill isn't "understand CAN bus debugging in general"
— it's having a **fixed decision tree you can run through fast**, so pit debugging
doesn't turn into open-ended exploration when you can least afford it:

```
Robot won't enable / a mechanism doesn't respond
│
├─ Does the Driver Station show a CAN error / device timeout?
│   ├─ YES → check Tuner X / REV Hardware Client device scan first.
│   │         Device missing entirely?      → wiring (connector, termination, power)
│   │         Device present, fault flag?   → firmware (reflash, check fault history)
│   │         Device present, no fault?     → code (wrong ID / wrong bus in code config)
│   └─ NO  → is it every mechanism, or just one?
│             Every mechanism / robot browns out → current-draw diagnosis (see §2)
│             Just one mechanism               → check that mechanism's device only
```

This is deliberately a *decision tree*, not a troubleshooting essay — the point is that
a student under time pressure can execute it without re-deriving the logic each time.

## 4. Walk Through It: A Fictional Debugging Scenario

> *Example status: illustrative, written for the 2026 season. This scenario, the team
> number, and every device name below are invented for teaching purposes — they are not
> a real match, a real robot, or anything from our own team's repo. Replace this section
> with a walkthrough of a real scenario from our own robot once we have one worth
> pointing students to.*

**Team 9999 (fictional)** is running a standard 4-module swerve. Partway through a
qualification match, the drive coach notices the robot "stutter" on one corner — a
half-second of lost power on the front-right module, several times over the course of
the match, but the robot never fully browns out or disables. Back in the pit, with a few
minutes before the next match, a student runs the decision tree from §3.

**Step 1 — Driver Station log check.** No full CAN timeout, no brownout event logged. So
this isn't the "every mechanism" branch of the decision tree (that's the brownout path,
§2) — it's isolated to one module. Straight to that module's device.

**Step 2 — Open Phoenix Tuner X, select the front-right drive Talon FX (device ID 4).**
Three things worth checking, in order, each pointing at a different layer:

- **Wiring signature:** with the robot on blocks and enabled at low power, a second
  student gently flexes the CAN wiring harness near the front-right module while
  watching the device list. If ID 4 **blinks in and out of the scan entirely** in sync
  with the flex, that's a physical-layer problem — a loose or damaged CAN connector —
  not a firmware or code issue. (This is what actually turns out to be wrong in this
  fictional scenario: a connector that was reseated during a mid-season swap wasn't
  fully clicked in.)
- **Brownout signature (ruled out here, but worth knowing how):** if the *supply
  voltage* trace in Tuner X's live plot dipped on ID 4 **at the same instant every other
  device's supply voltage also dipped**, that would point back to the shared brownout
  scenario in §2 — a power problem affecting the whole bus, not this module in
  isolation. In this scenario, the other three modules' voltage traces stay flat through
  the stutter, which is what rules brownout out.
- **Firmware-mismatch signature (also ruled out here, but common enough to check):**
  Tuner X flags a device whose firmware version doesn't match the rest of the fleet —
  this shows up as a version-mismatch warning, not a fault, and typically happens when a
  spare controller gets swapped in without being updated first. Worth a glance at the
  device's firmware version field even when it isn't the culprit, since it's a one-click
  check.

**Step 3 — Confirm and fix.** The flex test reproduces the dropout on demand, which is
enough to call it: reseat (or replace) the CAN connector at that module, re-run the flex
test to confirm it no longer drops, and clear the device's sticky faults in Tuner X
before the next match.

**If ID 4 had been a REV Spark Max instead of a Talon FX**, the same three checks happen
in **REV Hardware Client** instead: the device list is where you'd watch for it dropping
out during the flex test, and the Spark Max's own fault/sticky-fault history (visible in
its device page) is where a brownout or firmware-version issue would show up. The tool
window changes; the wiring → firmware → code logic from §1 doesn't.

## 5. Systemcore Transition

> **⚠️ Verify current status before each season.** This section describes an
> in-progress hardware transition. Treat every claim below as "true as of when this was
> written" — check FIRST's and WPILib's own release notes before relying on it,
> especially anything with a season number attached.

FRC's control system is mid-transition away from the roboRIO. **Systemcore** — built in
partnership with Limelight — is FIRST's next-generation robot controller, and it is the
primary content of this section deliberately: it's what a student joining the team from
this point forward will actually be working with, not a side note.

**What's confirmed as of this writing (mid-2026):**
- Systemcore hardware has been in public alpha/beta testing since 2025, with WPILib
  publishing early Systemcore-specific documentation and a dedicated testing repository
  for teams participating in FIRST's control-system beta program.
- Rollout information published by FIRST indicates every team will receive a Systemcore
  in their Kit of Parts starting with the **2027 season** (build season kicking off
  January 2027), at which point roboRIO is expected to no longer be the supported
  competition controller.
- FIRST has stated a goal of pricing Systemcore below the roboRIO's price point.

**What's genuinely unsettled — check before teaching this section again:**
- Exact terminology, connector types, and season boundaries have shifted more than once
  during the beta period (e.g. CAN connectors moving to 2-pin Molex SL, power input
  moving to a Molex Microfit+ bridge port) — expect more changes before general
  availability.
- **Note on Motioncore:** you may see "Motioncore" mentioned alongside Systemcore in
  FIRST/community material — that's a *FIRST Tech Challenge* companion device (power +
  CAN distribution for FTC's Control Hub), on its own separate FTC timeline. It isn't
  part of the FRC Systemcore rollout described here; don't conflate the two programs.

**roboRIO — the legacy platform (brief, on purpose):** the roboRIO (currently roboRIO 2,
as of the 2026 season) is the controller every FRC robot has run since well before this
transition began. If you're looking at an older robot or archived code, you'll see it
referenced as the CAN bus's root node and the target of all deployed robot code. Beyond
recognizing it as "the old controller," it isn't covered as equal-weight material here —
Systemcore is what's worth learning in depth going forward.

**Check for understanding:** have students find the current-season control system
requirement in that year's FRC game manual and confirm which controller (roboRIO or
Systemcore) it specifies — a good habit to build regardless of which platform is current
by the time they check.

## Resources

- [Phoenix Tuner X docs](https://v6.docs.ctr-electronics.com/en/stable/docs/tuner/index.html) — CTRE's own guide to every Tuner X feature described in §2; the first place to check when a CTRE-specific screen doesn't match what's described here.
- [Phoenix 6 documentation home](https://v6.docs.ctr-electronics.com/) — API reference and device Hardware User's Manuals for Talon FX, CANcoder, and Pigeon 2.
- [REV Hardware Client overview](https://docs.revrobotics.com/rev-hardware-client) — REV's equivalent reference for Spark Max/Flex configuration, firmware updates, and telemetry.
- [WPILib: Third-Party CAN Devices](https://docs.wpilib.org/en/stable/docs/software/can-devices/third-party-devices.html) — how CAN devices from any vendor fit into the robot code side, not just the config-tool side.
- [WPILib: Systemcore introduction](https://docs.wpilib.org/en/latest/docs/software/systemcore-info/systemcore-introduction.html) — the current official starting point for Systemcore specifics; check this first before teaching §5 again next season.
- [Chief Delphi: Systemcore rollout questions megathread](https://www.chiefdelphi.com/t/systemcore-motioncore-rollout-questions-frc-ftc/508694) — where the FRC community is actively tracking rollout changes in real time; useful for the "what's genuinely unsettled" parts of §5. (Thread title mentions Motioncore since it covers both FRC and FTC — the FRC-relevant content is Systemcore.)

**Hands-on exercise suggestions** (not built out yet — one-liners for later):
- Have each student pull up Tuner X (or REV Hardware Client) on an actual practice robot and produce a device-ID table like the one in §2 from a live scan, then intentionally unplug one device and identify the fault through the tool rather than by guessing.
- Run a mock "cold pit" drill: introduce a single fault (unplugged CAN connector, wrong device ID in code, or a code-side current limit removed) and time how long it takes a student to walk the decision tree in §3 to a correct diagnosis.
