# 03 — Roboflow

## 1. The General Idea

Training a useful object-detection model is rarely a one-shot process. The pattern that
actually works in practice is an **active-learning loop**:

1. **Label** a starting set of images (draw boxes/classes around the objects you care
   about).
2. **Train** a model on that labeled set.
3. **Test the model on real, unseen footage** — not just a held-out slice of your
   original data, but genuinely new conditions (different lighting, different angles,
   different backgrounds).
4. **Find the examples where it got it wrong** — the "hard examples" — label those
   specifically, and add them back into the training set.
5. Repeat.

This works better than trying to label a huge, perfect dataset up front, because you
don't know in advance which conditions will actually trip up your model — the loop lets
the model itself tell you where to spend your limited labeling effort. **Data
augmentation** (automatically generating variations of existing labeled images —
rotated, brightness-shifted, cropped, noise-added) is a cheap way to multiply a small
labeled set and make the model more robust to conditions you haven't captured real
photos of yet.

## 2. What This Looks Like in FRC

**Roboflow** (current as of the 2026 season) is the tool most FRC teams use to run this
loop: upload images, draw label boxes in its web-based annotation UI, apply
augmentations (rotation, brightness, blur, and similar transforms), and manage dataset
versions as you iterate.

The distinctive piece of FRC's setup is that **Roboflow exports directly into
Limelight's free Neural Network Trainer** (`tools.limelightvision.io`) — you export your
labeled/augmented dataset from Roboflow, hand it to Limelight's trainer, which trains on
cloud GPUs and hands back a model already packaged for whichever Limelight accelerator
you're targeting (onboard CPU, Google Coral, Hailo-8, or Hailo-8L — see `02_limelight`
for what those are). This closes the loop described in §1 without a team needing to run
their own training infrastructure at any step.

A concrete version of the loop, run over a build season:

1. Take a first batch of photos of the actual game piece (from the field kit, or from
   early prototype footage) and label them in Roboflow — maybe 100-200 images to start.
2. Export to the Limelight trainer, get back a detector model, load it onto the robot's
   Limelight.
3. Run the robot in practice matches or scrimmages and watch where detection actually
   fails — a game piece against a busy background, a piece partially covered by a
   robot arm, a piece under the venue's specific lighting.
4. Pull frames from that footage, label just the failure cases, add them to the Roboflow
   dataset, retrain.

## 3. Where It Diverges From the General Case

Two FRC-specific constraints make this loop harder to run than in most industrial
computer-vision settings:

- **The target class changes every year.** Most real-world computer vision projects get
  to reuse and refine a dataset for the same objects over years. FRC introduces a new
  game piece — a new shape, color, and material — with each new season's game manual, so
  a team effectively restarts step 1 of the loop every single year. There is no
  "last year's dataset" to lean on for the object itself (lighting/background
  augmentation techniques do carry over).
- **Real footage is scarce until very late in the loop.** The loop in §1 assumes you can
  keep testing against real-world conditions — but a team doesn't have the actual
  competition field, or even necessarily the finished robot, for most of the six-week
  build season (see `01_frc_intro`). Early iterations often have to lean on synthetic
  variety from augmentation and whatever prototype/practice-field footage exists, and
  the most valuable real-world testing (actual competition lighting, actual camera
  mounting angle, actual opponent robots in frame) often doesn't happen until the first
  competition itself — which is also when the cost of a bad detection model is highest.
  This is why iterating fast between events, not just before the season, matters.

## Resources

- [Roboflow Documentation](https://docs.roboflow.com/) — official docs for labeling, augmentation, and dataset export.
- [Limelight: Free Neural Network Trainer](https://tools.limelightvision.io/neural-network-trainer) — the tool that consumes Roboflow exports directly, described in §2.
- [Limelight: Training a Custom Detector Model](https://docs.limelightvision.io/docs/docs-limelight/pipeline-neural/training-your-own-detector) — Limelight's own walkthrough of the Roboflow-to-Limelight pipeline end to end.
- [Limelight: Training a Custom Classifier Model](https://docs.limelightvision.io/docs/docs-limelight/pipeline-neural/training-your-own-classifier) — the classifier-specific version of the same pipeline.

**Check for understanding / hands-on exercise suggestions:**
- Have students label a small set of images of an everyday object (not the game piece) in Roboflow, apply a couple of augmentations, and inspect what the augmented images actually look like — a fast way to build intuition for what augmentation is actually doing before it's applied to season-critical data.
- After the first trained model is on the robot, have students collect 10 "failure" frames from practice footage and walk through relabeling and re-exporting them — a small-scale run of the full loop in §1.
