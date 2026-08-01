# 02 — Limelight

## 1. The General Idea

A **smart camera** is a camera with enough onboard compute to process what it sees and
output a decision or a number, rather than just streaming raw pixels somewhere else for
another computer to process. This is a real architectural choice with tradeoffs: an
onboard-processing camera is easier to integrate (plug it in, read a result) but you're
stuck with whatever compute the manufacturer put inside it; a "dumb" camera plus a
separate compute unit (a **coprocessor**) is more flexible and often more powerful, but
you own the entire software stack and its integration. This is a specific case of the
local-vs-edge tradeoff covered generally in
[`ml_resources/edge_computing_primer/00`](../../ml_resources/edge_computing_primer/00-local-vs-cloud-vs-edge.md) —
a smart camera's onboard chip is purpose-built and resource-constrained (edge); a
coprocessor is closer to general-purpose local compute, just smaller than a laptop.

A **fiducial marker** is a printed pattern designed specifically to be easy for a
computer to detect and to precisely tell it something a natural image usually can't:
"you are looking at this marker from exactly this position and this angle." Because the
marker's real-world size and pattern are known in advance, a camera that sees it can
solve for its own position and orientation relative to that marker — this is how
augmented reality apps track a phone's position, and how warehouse robots localize
against wall-mounted markers.

## 2. What This Looks Like in FRC

**Limelight** is FRC's dominant smart-camera product: as of the 2026 season, the
current model is **Limelight 4**, built around a Raspberry Pi CM5 with an integrated
IMU, running Limelight's own onboard software (LLOS, currently on the 2026.x release
line). It plugs into the robot's network and exposes results — target position, distance,
pose — directly to robot code, with almost no vision-specific code required on the
roboRIO side.

Limelight ships several **pipelines** (processing modes you switch between):

- **AprilTag pipeline** — FRC's fiducial marker of choice. Each year's game manual
  publishes a fixed field map of AprilTag positions; a robot that sees a tag can solve
  not just "where is the tag relative to me" but, because the tag's field position is
  known, **"where am I on the field"** — this is full field-pose estimation, not just
  target-tracking. Limelight 4's onboard IMU fuses with AprilTag detections for more
  stable pose estimates, and a neural-net-assisted detector (added in recent LLOS
  releases) first roughly locates candidate tag regions before running the precise
  geometric solve on just that region, which helps at longer distances and difficult
  angles.
- **Neural Detector / Classifier pipelines** — object detection (find and locate a game
  piece) and classification (label what's in frame) using custom-trained neural
  networks, run on one of several supported accelerators: onboard CPU, **Google Coral**
  (USB3 EdgeTPU accelerator), or **Hailo-8 / Hailo-8L** (up to 26 TOPS on Hailo-8, with
  Hailo-8L support and a default detector model added across the LLOS 2026.0/2026.1
  releases). These are concrete points on the CPU/GPU/NPU/FPGA flexibility-vs-efficiency
  spectrum, and TOPS is the throughput spec named there — both covered generally in
  [`ml_resources/edge_computing_primer/01`](../../ml_resources/edge_computing_primer/01-compute-budgets-and-accelerators.md),
  including why a TOPS figure alone doesn't tell you whether a given accelerator will
  actually hit a robot's latency budget. Training these models is covered in
  `03_roboflow`.

**PhotonVision** is the leading open-source alternative: free, and built for teams that
want to run vision on their own coprocessor (commonly an Orange Pi or Raspberry Pi) with
full control over the software stack, at the cost of setting up and maintaining that
stack yourselves. Where Limelight is closer to "buy an appliance," PhotonVision is
closer to "assemble your own vision computer" — same underlying capabilities
(AprilTag pose estimation, object detection), different point on the
integration-effort-vs-cost-and-flexibility tradeoff described in §1.

## 3. Where It Diverges From the General Case

The general "smart camera vs. coprocessor" tradeoff exists everywhere, but FRC has two
constraints that push especially hard toward the "smart camera appliance" side for many
teams:

- **The six-week build season (see `01_frc_intro`) leaves little slack for a team to
  build and maintain a full custom vision stack from scratch**, especially teams
  without a programmer who has computer-vision experience coming in. A plug-in smart
  camera that gives you working AprilTag pose estimation in an afternoon is a genuine
  strategic advantage for a small or inexperienced programming team — not just a
  convenience.
- **The field's AprilTag layout is fixed and published in advance every season.** This
  is unusual compared to most real-world fiducial-marker applications, where you'd have
  to place and measure your own markers. FRC teams get a known, standardized map for
  free — it turns pose estimation from an open engineering problem into "run the
  pipeline against a map FIRST already gave you," which is part of why AprilTag-based
  localization became FRC-standard so quickly once it was introduced.

The PhotonVision-vs-Limelight choice, in practice, tends to track team size and
programming bandwidth more than raw capability — a well-resourced team with strong
programmers may prefer PhotonVision's openness and zero licensing cost; a smaller team
often values Limelight's "it just works" integration more than the flexibility they
wouldn't have time to use anyway.

## Resources

- [Limelight Documentation](https://docs.limelightvision.io/) — official docs; check the [software change log](https://docs.limelightvision.io/docs/docs-limelight/software-change-log) each season, since pipeline features and supported accelerators have changed release to release.
- [Limelight: Tracking AprilTags](https://docs.limelightvision.io/docs/docs-limelight/pipeline-apriltag/apriltags) — the AprilTag pipeline details referenced in §2.
- [PhotonVision Documentation](https://docs.photonvision.org/) — official docs for the open-source alternative discussed in §2.
- [WPILib: Vision Processing](https://docs.wpilib.org/en/stable/docs/software/vision-processing/index.html) — how vision results (from either tool) get consumed on the robot-code side.
- [`ml_resources/edge_computing_primer`](../../ml_resources/edge_computing_primer/README.md) — the general local/edge/cloud framing and accelerator mechanics (TOPS, latency budgets, CPU/GPU/NPU/FPGA) behind everything named in §2 above.

**Check for understanding / hands-on exercise suggestions:**
- Have students point a Limelight at a printed AprilTag at three different known distances and compare the reported pose to a tape-measure ground truth — a fast way to build intuition for what "pose estimation error" actually looks like in practice.
- Compare a Limelight's out-of-the-box AprilTag setup time against standing up a minimal PhotonVision pipeline on a coprocessor, and discuss where the time actually goes in each case.
