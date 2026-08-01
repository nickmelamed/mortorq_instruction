# Edge Computing Resource Page

Every primer up to this point in `ml_resources` ended at the same finish line: you have
a trained model. `perception_primer` even handed you a specific one -
`yolov8n.pt` - and stopped there. None of them asked what happens next: where that
model actually runs, what it costs to run it there, and what changes about a model once
it stops being a file on a laptop and starts being a physical component riding around
on a robot. This primer is where "trained" stops being the finish line.

## What is Edge Computing?

Edge computing means running inference on a resource-constrained, often purpose-built
device that's physically co-located with whatever is generating the data - not on a
general-purpose laptop, and not on a remote server reached over a network. It's the
third point on a triangle most people only ever think of two corners of: **cloud**
(remote, elastic, network-dependent) and **local** (nearby, general-purpose, assumed
free of any constraint that matters). Edge is what's left when a device needs no
network dependency *and* has none of a laptop's general-purpose slack to fall back on.

## Why should I care?

This primer exists because of a very concrete, current fact about this team's own
tools: Limelight's neural pipelines run on a **Hailo-8 / Hailo-8L** accelerator chip
(`frc_resources/02_limelight`), the Roboflow-to-Limelight training pipeline
(`frc_resources/03_roboflow`) ends with a model compiled specifically for that chip,
and FRC's control system itself is mid-transition from the **roboRIO** to
**Systemcore** (`frc_resources/06_hardware_debugging` §5). All three of those are edge
computing, named as such nowhere in this curriculum until now. This primer gives the
general vocabulary and mechanics those FRC-specific modules were always assuming.

## Key Terms

A running glossary of vocabulary introduced across this primer, in the order you'll
meet it. See also the [cv_primer](../cv_primer/README.md) glossary for Neuron and CNN,
the [deep_learning_primer](../deep_learning_primer/README.md) glossary for Loss
Gradient and Backward Pass (Backpropagation) - both extended here in `04`/`05` to
gradients with respect to *inputs and old-task weights*, not just the weights being
trained - and the [perception_primer](../perception_primer/README.md) glossary for
Object Detection and YOLO, the model family this primer's `02` compresses and `03`
deploys.

- **Cloud**: compute that runs on a remote server reached over a network - elastic and
  powerful, but dependent on connectivity and paying a round-trip cost on every request.
- **Local**: compute that runs on a general-purpose device you have direct physical
  access to (e.g. a laptop) - no network dependency, but only "free" because it's
  overprovisioned for small jobs.
- **Edge**: compute that runs on a purpose-built, resource-constrained device
  co-located with the system generating the data - no network dependency, and no
  general-purpose slack to fall back on either.
- **Throughput**: how many operations per second a chip can perform, most often
  quoted as TOPS.
- **TOPS (Trillions of Operations Per Second)**: an accelerator's headline
  throughput spec, measured under ideal conditions - necessary but not sufficient for
  predicting real performance, since it says nothing about memory bandwidth.
- **Latency**: how long a single inference takes, start to finish - a different
  quantity from throughput, and the one that actually determines whether a result
  arrives in time to be useful.
- **Latency budget**: the deadline a given application actually imposes on latency -
  e.g. how long you have per camera frame before a detection is too stale to act on.
- **Power / thermal budget**: the fixed limit on watts drawn and heat dissipated that a
  battery-powered, fan-less device has to operate within.
- **CPU**: fully general-purpose compute; runs anything, worst performance-per-watt for
  neural network math specifically.
- **GPU**: massively parallel compute, a large step up in neural-network throughput
  over a CPU, still general-purpose enough to run other parallel workloads.
- **NPU / TPU / other ASIC**: silicon custom-designed to run neural network operations
  and nothing else - best performance-per-watt of the group, at the cost of
  flexibility.
- **FPGA**: reconfigurable logic, reprogrammable after manufacturing - a middle point
  between a GPU's flexibility and an ASIC's efficiency.
- **Batch size**: how many inputs are processed together in a single pass; cloud
  inference can batch for efficiency, edge inference processing a live feed almost
  always can't (**batch size 1**).
- **Input resolution**: the size of the image fed to a model - a direct knob trading
  accuracy for compute cost.
- **Model scale**: which size variant of an architecture you deploy (e.g. YOLOv8n vs.
  s/m/l/x) - capacity and accuracy traded for compute cost.
- **Numeric precision**: the bit-width used for a model's arithmetic (fp32/fp16/int8) -
  the single biggest lever for fitting a model inside a fixed compute budget.
- **Quantization**: converting a model's weights (and often activations) to a lower
  numeric precision, most commonly int8 - `02`'s main subject.
- **Dynamic quantization**: a quantization method that computes activation ranges at
  inference time rather than from calibration data - simple to run, better suited to
  RNNs/transformers than CNNs.
- **Export**: converting a trained model out of its training framework and into a
  neutral interchange format.
- **ONNX (Open Neural Network Exchange)**: the interchange format `02` exported to and
  `03` names as the standard neutral middle layer between training frameworks and
  deployment toolchains.
- **Convert / compile**: transforming an interchange-format model into a binary a
  specific target chip can execute - mandatory, not optional, on real accelerator
  hardware.
- **Benchmark (on-device)**: measuring real latency, size, and accuracy on the actual
  target hardware - the only measurement TOPS and a proxy-hardware benchmark can't
  substitute for.
- **On-device training**: updating a model's own weights using data collected after
  deployment, on the constrained device itself, rather than treating weights as frozen
  at deployment time.
- **Continual learning**: the general problem of learning from new data over time
  without erasing what a model already knew.
- **Catastrophic forgetting**: the failure mode where training on a new task sharply
  destroys a network's performance on a previously learned task.
- **Stability-plasticity dilemma**: the underlying tension behind catastrophic
  forgetting - a network plastic enough to learn quickly is, by the same property, one
  that overwrites old knowledge quickly.
- **Rehearsal (replay)**: a mitigation for catastrophic forgetting that mixes a small
  buffer of old-task examples into new-task training, at a real cost to how well the
  new task is learned.
- **Adversarial example**: an input deliberately, minimally modified using a model's
  own gradients to cause a wrong prediction, small enough that a human barely notices
  the change.
- **FGSM (Fast Gradient Sign Method)**: the simplest widely-used adversarial attack -
  a single gradient computation that nudges every input pixel by a tiny fixed amount in
  the direction that most increases the model's loss.
- **Distribution shift**: an input that's simply unlike the training data (different
  lighting, background, etc.) - not an adversarial example, since no gradient was used
  to construct it, but easy to mistake for one.
- **Transferability**: the property where an adversarial perturbation crafted for one
  input or model still fools a different input or model.

## What's in this Primer?

Read these in order:

1. [00 - Local vs. Cloud vs. Edge](00-local-vs-cloud-vs-edge.md) - the three places
   compute can happen, and why "local" quietly became the invisible default
2. [01 - Compute Budgets and Accelerators](01-compute-budgets-and-accelerators.md) -
   TOPS, latency budgets, the CPU/GPU/NPU/FPGA spectrum, and the hyperparameters that
   spend a fixed compute budget
3. [02 - Model Compression](02-model-compression.ipynb) - a real quantization exercise
   on `perception_primer`'s `yolov8n.pt`, with measured size and latency before and
   after
4. [03 - The Deployment Pipeline](03-deployment-pipeline.md) - train → export → convert
   / compile → benchmark, and why the last step can't be skipped or proxied
5. [04 - On-Device Training and Continual Learning](04-on-device-training-and-continual-learning.ipynb) -
   a real catastrophic-forgetting demo, motivated directly by `frc_resources/03_roboflow`'s
   "the target class changes every year" problem
6. [05 - Adversarial and Security Considerations](05-adversarial-and-security-considerations.ipynb) -
   a real FGSM demo, and an honest read on how much of this threat model actually
   applies to a competition robot

## Where This Goes Next

Every FRC-specific tool this primer named in passing - Limelight's Hailo-8/Hailo-8L
pipelines (`frc_resources/02_limelight`), the Roboflow export pipeline
(`frc_resources/03_roboflow`), and the roboRIO-to-Systemcore transition
(`frc_resources/06_hardware_debugging` §5) - is a concrete instance of the general
mechanics covered here, and each of those modules now links back to the specific
notebook here that explains its underlying general concept.
