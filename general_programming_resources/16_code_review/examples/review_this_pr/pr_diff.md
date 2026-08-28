# PR: fix(sensor): smooth out noisy distance readings after boot

## What
Increased the distance sensor's smoothing window from 5 samples to 10.

## Why
Distance readings were noisy right after the robot boots up, which was
occasionally causing false "piece detected" triggers during the first few
ticks of a match.

## How to test
Ran the sensor smoother in simulation for 20 ticks right after boot and
confirmed the readings looked less noisy than before.

## Diff

```diff
 public class SensorSmoother {
-    private static final int WINDOW_SIZE = 5;
+    private static final int WINDOW_SIZE = 10;
     private double[] samples = new double[WINDOW_SIZE];
     private int count = 0;

     public double addSample(double value) {
         samples[count % WINDOW_SIZE] = value;
         count++;
         double sum = 0;
         for (double s : samples) sum += s;
         return sum / WINDOW_SIZE;
     }
 }
```

*(Full file for reference — this is the entire class, before and after; the diff above is the only change in the PR.)*
