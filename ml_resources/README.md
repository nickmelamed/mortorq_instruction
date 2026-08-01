# ML Resources: Machine Learning, Perception, and Generative AI

Nine primers, from "what is a model" through building a Transformer block and deploying
a compressed model to real edge hardware. Each primer's own `README.md` is the real
source of truth for its scope and its own "Key Terms" glossary — this page exists because
none of that adds up to a single, discoverable reading order on its own. Every ordering
claim below comes directly from what each primer's own README already says it builds on;
this page just puts all nine in one place.

## Suggested order

```text
1. ml_primer                    Model, regression/classification, overfitting, train/val/test
2. linear_algebra_primer        Vectors, matrices, batches -- just enough to read everything after this
3. cv_primer                    Pixels, neurons/layers, convolution, camera projection basics
4. perception_primer (01-05)    Object detection, camera intrinsics/extrinsics, depth, optical flow
5. deep_learning_primer         Backpropagation for real, value/policy network output heads
6. perception_primer (06-07)    Trajectory prediction -- needs 5's Regression/Classification Heads
7. rl_primer                    MDPs, Q-learning, policy gradients -- what value/policy networks train on
8. unsupervised_learning_primer Clustering, PCA, autoencoders, anomaly detection -- no labels at all
9. genai_architecture_primer    Tokenization, attention, the Transformer block
10. edge_computing_primer       Deploying a trained model to real, resource-constrained hardware
```

Two things worth knowing about this list before you follow it too literally:

- **`perception_primer` splits in two.** Its first five notebooks (object detection through
  optical flow) only need `ml_primer` and `cv_primer`. Its last two
  (`06-trajectory-prediction.ipynb`, `07-multi-hypothesis-prediction.ipynb`) need
  `deep_learning_primer`'s Regression/Classification Heads first — see
  `perception_primer/README.md`'s own glossary note. Either do `deep_learning_primer` in
  full before starting `perception_primer`, or stop after `perception_primer/05` and
  detour to `deep_learning_primer` before finishing it.
- **`genai_architecture_primer` doesn't strictly need `rl_primer` or
  `unsupervised_learning_primer`** — it only builds on `linear_algebra_primer` and
  `deep_learning_primer`. It's placed after both here because that's the order this
  curriculum was written and cross-referenced in, not because of a hard dependency; if
  you're specifically chasing "how does a chatbot work," you can jump to it right after
  `deep_learning_primer`.

`edge_computing_primer` is unambiguously last: its own README opens by pointing out that
every other primer here "ended at the same finish line: you have a trained model," and
it's the one that asks what happens after that.

## Why this order, one link at a time

Each arrow below is a real claim from the primer on the receiving end, not an invented
dependency:

- `ml_primer` → `linear_algebra_primer`: linear algebra names the math you were already
  running inside `numpy` calls in `ml_primer`, so later primers read as math, not just code.
- `linear_algebra_primer` → `cv_primer`: a neuron's weighted sum and a convolution kernel
  are both the matrix-vector product `linear_algebra_primer/02` names directly.
- `cv_primer` → `deep_learning_primer`: `deep_learning_primer` "picks up where
  `cv_primer/03-neural-networks.ipynb` left off," opening the black box `sklearn`'s
  `.fit()` was hiding there.
- `cv_primer` + `deep_learning_primer` → `perception_primer`: object detection, camera
  geometry, and optical flow build on `cv_primer` directly; trajectory prediction
  (`06`-`07`) additionally needs `deep_learning_primer`'s output-head vocabulary.
- `deep_learning_primer` → `rl_primer`: `deep_learning_primer` built a Value Network and
  a Policy Network and explicitly left "what do you train these on?" open —
  `rl_primer` is the answer.
- `rl_primer` → `unsupervised_learning_primer`: `unsupervised_learning_primer`'s own
  README lists `cv_primer`, `perception_primer`, `deep_learning_primer`, and `rl_primer`
  as everything that came before it needing "a label or a reward signal to train
  against," then drops that assumption for the first time.
- `linear_algebra_primer` + `deep_learning_primer` → `genai_architecture_primer`: the
  attention mechanism is `linear_algebra_primer/03`'s all-pairs pattern; the Transformer
  block's feedforward network is `deep_learning_primer`'s network body with a residual
  connection wrapped around it.
- Everything → `edge_computing_primer`: it deploys `perception_primer`'s own
  `yolov8n.pt`, and closes the loop back to `frc_resources/02_limelight` and
  `frc_resources/03_roboflow`, which is where this whole tree of primers connects back
  to an actual robot.

## Where this connects to FRC

`edge_computing_primer` is the primer with the tightest, most explicit FRC connection —
its README names `frc_resources/02_limelight`'s Hailo accelerator, `frc_resources/03_roboflow`'s
export pipeline, and `frc_resources/06_hardware_debugging`'s roboRIO-to-Systemcore
transition directly, and those `frc_resources` modules link back to the specific
notebooks here that explain the general mechanics underneath them. `cv_primer` and
`perception_primer` are named in `frc_resources/02_limelight` and `frc_resources/03_roboflow`'s
prose (object detection, the neural pipelines a Limelight runs) without a direct link
back yet — if you're coming from `frc_resources` looking for the underlying vision/tracking
math, `cv_primer` and `perception_primer` are the two primers to start with.

`rl_primer` and `agent_primer/13-integrating-a-trained-model.md` (in `ai_resources`) are
the other real connection point: this team's stated plan for its scouting agent is a
value/policy network, trained the way `rl_primer` teaches, wired in as a tool the way
`13` describes.

## Setup notes

All nine primers run as Jupyter notebooks against the environment described in the root
`README.md` — set that up first if you haven't. `edge_computing_primer/02` and `04` use
`perception_primer`'s `yolov8n.pt`, which is gitignored and downloaded on first run, not
committed to this repo.
