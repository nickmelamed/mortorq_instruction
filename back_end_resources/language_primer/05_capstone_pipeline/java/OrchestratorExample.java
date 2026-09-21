// 05 Capstone: Java Orchestration (illustrative, simplified)
//
// This is not a full WPILib project. It's a small, standalone,
// compilable example showing the *shape* of the code that would consume
// cpp/infer.cpp's output on a real robot. Compile and run it directly:
//
//   $ javac OrchestratorExample.java
//   $ java OrchestratorExample
//
// On a real robot, the coprocessor running infer.cpp would publish its
// results to NetworkTables once per frame and this class would read them from there 
// instead of from the hardcoded `simulatedFrames` array below. That real version would
// look like:
//
//   NetworkTable table = NetworkTableInstance.getDefault().getTable("detector");
//   int label = (int) table.getEntry("label").getDouble(-1);
//   double confidence = table.getEntry("confidence").getDouble(0.0);
//
// which is exactly how PhotonVision and Limelight hand their own detection
// results to your robot code today. Everything else below (the decision
// logic in processDetection()) would be identical either way.
public class OrchestratorExample {

    record DetectionResult(int label, double confidence) {}

    static final double CONFIDENCE_THRESHOLD = 0.75;

    public static void main(String[] args) {
        // Stand-ins for what infer.cpp would have produced, frame by frame,
        // if this were reading real NetworkTables values instead. The first
        // three are representative of the values infer.cpp's demo produces for
        // its three hand-picked feature vectors -- your exact numbers may drift
        // slightly by environment/training run, but notice the "ambiguous" one
        // is meant to land in the "detected, but not confident enough to act"
        // branch below, just barely; the fourth doesn't come from infer.cpp at
        // all, it's added here to give a second, more confident data point in
        // that same branch, so the threshold cutoff isn't judged from a
        // single barely-over-50% example alone.
        DetectionResult[] simulatedFrames = {
            new DetectionResult(1, 0.98),   // a clear game piece
            new DetectionResult(0, 0.9998), // clear noise
            new DetectionResult(1, 0.51),   // the "ambiguous" case from infer.cpp's demo -- barely tips toward "game piece"
            new DetectionResult(1, 0.60),   // looks like a game piece, more confidently, but still not enough to act on
        };

        for (DetectionResult frame : simulatedFrames) {
            processDetection(frame);
        }
    }

    // The actual orchestration decision. Notice this method knows nothing
    // about feature vectors, ONNX, or neural networks; exactly like a
    // Subsystem in 02_oop_inheritance only needing to know "this is a
    // Motor," not which concrete motor controller it actually is.
    static void processDetection(DetectionResult detection) {
        boolean isGamePiece = detection.label() == 1;
        boolean isConfident = detection.confidence() >= CONFIDENCE_THRESHOLD;

        if (isGamePiece && isConfident) {
            System.out.printf(
                "Game piece detected (confidence %.4f) -> running intake command%n", detection.confidence());
        } else if (isGamePiece) {
            System.out.printf(
                "Possible game piece (confidence %.4f) -> below threshold, ignoring%n", detection.confidence());
        } else {
            System.out.printf(
                "No game piece detected (confidence %.4f) -> continuing search%n", detection.confidence());
        }
    }
}
