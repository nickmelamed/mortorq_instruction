// 02 - Communication & Serialization: NetworkTables publish/subscribe
//
// This is a simplified, in-memory stand-in for real WPILib NetworkTables --
// no live roboRIO, driver station, or coprocessor connection needed to run
// it. The real API (from the `edu.wpi.first.networktables` package) looks
// like this:
//
//   NetworkTable table = NetworkTableInstance.getDefault().getTable("detector");
//   table.getEntry("label").setDouble(1);                 // publishing
//   double label = table.getEntry("label").getDouble(-1); // subscribing
//   table.getEntry("label").addListener(...);             // reacting to changes
//
// MockNetworkTable below mirrors that same publish/subscribe *shape* --
// named keys, a publisher that doesn't know who's listening, subscribers
// that can either poll a value or register a listener -- using nothing but
// a plain in-memory map, so the pattern is visible without any networking
// or WPILib dependency at all.
//
// Compile and run directly:
//   $ javac NetworkTablesDemo.java
//   $ java NetworkTablesDemo
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;
import java.util.function.BiConsumer;

public class NetworkTablesDemo {

    // A tiny stand-in for one NetworkTables "table": a named group of
    // key/value entries, plus listeners that get called whenever a key changes.
    static class MockNetworkTable {
        private final Map<String, Double> values = new HashMap<>();
        private final List<BiConsumer<String, Double>> listeners = new ArrayList<>();

        // Publisher side: write a value under a key. Any number of
        // subscribers can read it, or be listening for the change -- the
        // publisher never needs to know how many, or who.
        void publish(String key, double value) {
            values.put(key, value);
            for (BiConsumer<String, Double> listener : listeners) {
                listener.accept(key, value);
            }
        }

        // Subscriber side, polling style: ask for the current value right now.
        double get(String key, double defaultValue) {
            return values.getOrDefault(key, defaultValue);
        }

        // Subscriber side, reactive style: get called automatically whenever
        // ANY key in this table is published to, instead of polling for it.
        void addListener(BiConsumer<String, Double> listener) {
            listeners.add(listener);
        }
    }

    public static void main(String[] args) {
        MockNetworkTable detectorTable = new MockNetworkTable();

        // Robot side: subscribe once, react every time a new value comes in.
        // On a real robot this is exactly how you'd react to a coprocessor's
        // vision results without polling for them every single tick.
        detectorTable.addListener((key, value) ->
            System.out.printf("  [robot listener] %s changed -> %.2f%n", key, value));

        System.out.println("Simulating a coprocessor publishing detection results, frame by frame:\n");

        double[][] frames = {
            // label, confidence, x, y
            {1, 0.95, 0.42, 0.61},
            {0, 0.88, 0.10, 0.15},
            {1, 0.99, 0.55, 0.48},
        };

        for (int frame = 0; frame < frames.length; frame++) {
            System.out.println("frame " + frame + ":");
            detectorTable.publish("label", frames[frame][0]);
            detectorTable.publish("confidence", frames[frame][1]);
            detectorTable.publish("x", frames[frame][2]);
            detectorTable.publish("y", frames[frame][3]);

            // Robot side, polling style: this is what a periodic() method
            // would do every tick -- just ask the table for the latest
            // value, with a safe default if nothing's been published yet.
            double label = detectorTable.get("label", -1);
            double confidence = detectorTable.get("confidence", 0.0);
            System.out.printf("  [robot poll] latest label=%.0f confidence=%.2f%n%n", label, confidence);
        }
    }
}
