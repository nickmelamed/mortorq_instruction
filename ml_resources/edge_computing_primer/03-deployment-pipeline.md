# The Deployment Pipeline

`02` did four things to `yolov8n.pt` in sequence, without pausing to name the pattern:
trained weights in, an interchange format out, a quantized version of that format out,
and then a measurement of what actually changed. That sequence isn't specific to
quantization - it's the general shape every trained model takes on its way to running
somewhere resource-constrained. This notebook names the four stages explicitly and
explains why each one exists.

## The Four Stages

```
   Train                    Export                  Convert / Compile         Benchmark
(unconstrained    →    (interchange format,    →    (target-accelerator-  →  (measured on the
 machine, no             e.g. ONNX - what            specific binary,          ACTUAL target
 different from           02 produced)                what a Hailo/Coral/       device - not a
 any other notebook                                   etc. toolchain            proxy)
 in this curriculum)                                  produces from ONNX)
```

1. **Train** - ordinary model training, on whatever unconstrained machine you have
   access to. Nothing about this stage is edge-specific; it's every notebook before
   this primer.
2. **Export** - convert the trained model out of its training framework and into a
   neutral interchange format. `02` used **ONNX** for exactly this reason.
3. **Convert / compile** - transform that interchange-format model into a binary the
   *specific target chip* can actually execute, using that chip vendor's own toolchain.
4. **Benchmark** - measure real latency, size, and accuracy on the real target device,
   not a stand-in for it.

## Why Export Is Its Own Stage

The reason export exists as a separate step rather than training directly in whatever
format a chip wants is a decoupling argument: an interchange format like ONNX separates
*what framework you trained in* from *what silicon will run it*. PyTorch, TensorFlow,
and scikit-learn can all export to ONNX; dozens of very different downstream runtimes
and compilers can all read it. Without that neutral middle layer, every combination of
training framework and target chip would need its own direct conversion path - export
to a shared interchange format turns an ($M$ frameworks) × ($N$ chips) problem into
$M$ export steps plus $N$ import steps. (See the
[ONNX documentation](https://onnx.ai/onnx/) for the format itself.)

## Why Convert/Compile Isn't Optional on Real Edge Hardware

In `02`, both the fp32 and int8 versions of the model ran on the same generic
CPU-based ONNX Runtime - conversion happened (export to ONNX), but there was no
chip-specific compile step, because a laptop CPU can execute a generic ONNX graph
directly. That's not true of a real edge accelerator. A purpose-built NPU/ASIC
(`01` covered why they're built that way) typically **cannot execute an arbitrary ONNX
graph at all** - it has a fixed, much narrower instruction set than a CPU, and needs a
vendor-specific compiler to translate the ONNX graph into something that chip's
specific hardware understands. On real edge silicon, this step is the difference
between "runs" and "doesn't run," not a speed optimization layered on top of something
that already worked. This is the mandatory hop underneath the Roboflow-to-Limelight
step described in `frc_resources/03_roboflow` - what looks like a single "export your
dataset" button is a full trip through this stage on Limelight's own build servers,
producing a binary specific to whichever accelerator (onboard CPU, Coral, Hailo-8,
Hailo-8L) that particular Limelight is targeting.

## Why Benchmark-on-Device Is the Step That Actually Matters

`02` produced a genuinely important negative result: quantization reliably shrank the
model (~3.5-4x smaller), but barely moved - and in that run, even slightly worsened -
measured latency on a laptop CPU. That's not a failure of the exercise; it's the exact
argument this stage is built around. `01` already named the mechanism: TOPS is a
peak-throughput number that assumes the chip's compute units are kept fed, and whether
they actually are depends on memory bandwidth and how well a specific runtime exploits
a specific chip's specialized execution paths - none of which a spec sheet, or a
benchmark run on different hardware, can tell you. A model that shows no latency
improvement on a generic CPU could show a large one on a Hailo-8, whose silicon is
built specifically to accelerate int8 operations the way a general-purpose CPU core
isn't. The only way to know which is true for *your* model on *your* target chip is to
run stage 4 on that actual chip - which is exactly why `02` could only responsibly
report "quantization shrinks the model" as a general claim, and had to leave "does it
speed things up" as an open question depending on where you actually deploy it.

## Closing the Loop: This Pipeline Runs Every Time the Active-Learning Loop Does

`frc_resources/03_roboflow` describes an active-learning loop: label, train, test on
real footage, find hard examples, relabel, retrain. Every single "retrain" step in that
loop has to pass through all four stages above - export, convert, benchmark - before
the improved model is actually back on the robot detecting anything. The active-learning
loop is about *what data* goes into each retraining pass; this pipeline is the
mechanical process that turns each of those retrained models into something that
actually runs on the accelerator sitting inside the Limelight. Skipping stages 2-4
isn't an option - a `.pt` file sitting on a laptop, however well it scored in training,
detects nothing on the robot until it's made the full trip through this pipeline.

## Resources

- [ONNX documentation](https://onnx.ai/onnx/) - the interchange-format concept referenced
  in §2, and the format `02` used directly.
- [Ultralytics: Model Export](https://docs.ultralytics.com/modes/export) - the
  export/convert step for the specific model family this primer has used throughout,
  including formats aimed at real edge accelerators, not just ONNX.
- `frc_resources/02_limelight` and `frc_resources/03_roboflow` - the concrete FRC
  instance of every stage in this pipeline: what compiles Roboflow's exported dataset
  into a Limelight-ready model, and what accelerators it can target.

**Try It Yourself:** Using `02`'s benchmark numbers (or ones you produce yourself),
write out - in your own words, no code needed - which of the four stages above would
change if you swapped the target device from "generic laptop CPU" to a real edge
accelerator. Which stage's *output* changes? Which stage's *necessity* changes (from
optional/trivial to mandatory)?
