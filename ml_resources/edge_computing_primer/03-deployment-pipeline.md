# The Deployment Pipeline

`02` did four things to `yolov8n.pt` in sequence: trained weights in, an interchange format out, a quantized version of that format out, and then a measurement of what actually changed. 

That sequence isn't specific to quantization. It's the general shape every trained model takes on its way to running somewhere resource-constrained.

## The Four Stages

```
   Train                    Export                  Convert / Compile         Benchmark
(unconstrained    →    (interchange format,    →    (target-accelerator-  →  (measured on the
 machine, no             e.g. ONNX, what            specific binary,          ACTUAL target
 different from           02 produced)                what a Hailo/Coral/       device, not a
 any other notebook                                   etc. toolchain            proxy)
 in this curriculum)                                  produces from ONNX)
```

1. **Train** - ordinary model training, on whatever unconstrained machine you have
   access to.
2. **Export** - convert the trained model out of its training framework and into a
   neutral interchange format. `02` used **ONNX** for this. 
3. **Convert / compile** - transform that interchange-format model into a binary the
   *specific target chip* can actually execute, using that chip vendor's own toolchain.
4. **Benchmark** - measure real latency, size, and accuracy on the real target device.

## Why Export Is Its Own Stage

It's fair to wonder why we would export at all, instead of just training on the target format. 

We can train different models through a lot of different frameworks, like PyTorch, TensorFlow, and scikit-learn. They would all need their own direct conversion path. Instead, if we use something like ONNX, we can export to a neutral framework, and then proceed from there regardless of the training framework we used. 

See the [ONNX documentation](https://onnx.ai/onnx/) for the format itself. 

## Why Convert/Compile Isn't Optional

Ok, so we've established why we need export, but why do we need to convert and compile? 

In `02`, both the fp32 and int8 versions of the model ran on the same generic
CPU-based ONNX Runtime. Conversion happened (export to ONNX), but there was no
chip-specific compile step, because a laptop CPU can execute a generic ONNX graph
directly. 

Unfortunately, that's not true of a real edge accelerator. A purpose-built NPU/ASIC
typically cannot execute an arbitrary ONNX graph. Because of its construction, it has a fixed, much narrower instruction set than a CPU, and needs a
vendor-specific compiler to translate the ONNX graph into something that chip's
specific hardware understands.

## Why Benchmark-on-Device Matters

`02` produced an important negative result: quantization reliably shrank the
model (~3.5-4x smaller), but barely moved (and in that run, even slightly worsened)
measured latency on a laptop CPU.

Remember from `01` that TOPS is a peak-throughput number that assumes the chip's compute units are kept fed, and whether they actually are depends on memory bandwidth and how well a specific runtime exploits
a specific chip's specialized execution paths. Also remember that none of this is something a spec sheet, or a benchmark run on different hardware, can tell you. 

A model that shows no latency improvement on a generic CPU could show a large one on a Hailo-8, whose silicon is built specifically to accelerate int8 operations the way a general-purpose CPU core isn't. The only way to know which is true is to run your model on your edge device! 

## How this Relates to Roboflow

`frc_resources/03_roboflow` describes an active-learning loop: label, train, test on
real footage, find hard examples, relabel, retrain. Every single "retrain" step in that loop has to pass through all of the stages we just talked about before
the improved model is back on the robot detecting anything. 

The active-learning loop is about what data goes into each retraining pass; this pipeline is the mechanical process that turns each of those retrained models into something that runs on the accelerator sitting inside the Limelight.

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
write out which of the four stages above would change if you swapped the target device from "generic laptop CPU" to a real edge accelerator. Which stage's *output* changes? Which stage's *necessity* changes (from optional/trivial to mandatory)?
