# Perception Resource Page 

The `perception_primer` will teach some basic Computer Vision concepts that will build a foundation for us to understand the higher-level Perception concepts for object detection in FIRST. 

## What is Perception?

In robotics, Perception refers to the ability of the robot to use sensors to gather data about its internal state as well as its environment. This information is ultimately processed through various algorithms to fuel autonomous action, like through out AutoPaths, for instance. 

## Why should I care? 

Perception fuels every action of our robot - from estimating position on the field by reading in AprilTags from Limelights, to using CANRange to estimate intake capacity, all of these fall under the field of Perception. Since this field is so vast, our focus is going to be understanding some key concepts in Perception to build a deeper understanding of how our robots can process information. 

## Key Terms

A running glossary of vocabulary introduced across this primer, in the order you'll meet it. See also the [ml_primer](../ml_primer/README.md) and [cv_primer](../cv_primer/README.md) glossaries for foundational terms like model, regression, classification, and camera intrinsics, which this primer builds on directly, and the [linear_algebra_primer](../linear_algebra_primer/README.md) glossary for the vector/matrix vocabulary (Rotation Matrix, Translation Matrix, Euclidean distance) this primer's pose-estimation and tracking math is built from. `06-trajectory-prediction.ipynb` additionally builds directly on the [deep_learning_primer](../deep_learning_primer/README.md)'s Regression Head and backpropagation. `07-multi-hypothesis-prediction.ipynb` further builds on the Classification Head/softmax machinery from `deep_learning_primer/02` and the same cross-entropy-shaped gradient used in [rl_primer](../rl_primer/README.md)'s `02-policy-gradients.ipynb`.

- **Loss**: the metric used to guide model training (e.g., minimized during fitting).
- **Performance**: the metric(s) used to evaluate a trained model's results, which may or may not be the same as the loss.
- **Binary Cross Entropy (BCE) Loss**: the standard loss function for binary classification, based on predicted probabilities.
- **Accuracy**: the proportion of all predictions a model got correct - misleading on imbalanced datasets.
- **Specificity / True Negative Rate (TNR)**: out of all true-negative cases, the proportion correctly predicted negative.
- **F1 Score**: the harmonic mean of precision and recall, balancing the two into a single metric.
- **Object Detection**: the combined task of classifying an object and localizing it within a frame.
- **Localization**: determining where an object is within a frame, typically via a bounding box.
- **Bounding Box**: a rectangle, defined by coordinates and a height/width, marking where an object is located in an image.
- **Ground Truth**: the manually- or expert-verified "true" label or bounding box a prediction is compared against.
- **Intersection over Union (IoU)**: the ratio of overlap area to total area between a predicted and ground-truth bounding box, used to score localization accuracy.
- **YOLO (You Only Look Once)**: a family of object detection models that treats detection as a single regression problem over the whole image, rather than first proposing regions.
- **Intrinsic Matrix ($K$)**: the matrix encoding a camera's focal length(s) and principal point, used to map camera-coordinate points to pixel coordinates.
- **Extrinsic Matrix ($M = [R \mid t]$)**: the matrix encoding a camera's rotation and position in the world, used to map world coordinates to camera coordinates.
- **Rotation Matrix ($R$)**: a matrix that rotates points in space without changing their size or shape.
- **Translation Matrix ($t$)**: a vector that shifts points in space by a fixed amount in a given direction.
- **Triangulation**: recovering a 3D point's position from two (or more) viewing rays, e.g. from two cameras or one moving camera.
- **Stereo Depth**: a triangulation technique that computes depth from the pixel disparity between two calibrated, rectified cameras.
- **Disparity**: the horizontal pixel difference between corresponding points in a rectified stereo image pair.
- **Structure from Motion**: recovering 3D structure via triangulation using a single moving camera over time, instead of two cameras.
- **Perspective-n-Point (PnP)**: the technique of estimating a camera's extrinsics from known 3D geometry (e.g., an AprilTag) and its observed 2D projection.
- **Monocular Depth Estimation**: predicting per-pixel depth from a single 2D image using a trained ML model, rather than geometric triangulation.
- **Pose Estimation**: determining the 3D position (and orientation) of an object or camera.
- **Displacement**: the change in a pixel's (or object's) position between two frames, often denoted $\Delta$ or $d$.
- **Optical Flow**: tracking the apparent motion of pixels between consecutive frames, under the assumption of brightness constancy.
- **Brightness Constancy**: the assumption that a tracked point's intensity doesn't change between frames, only its position.
- **Sparse Optical Flow**: optical flow computed for only a selected subset of "important" pixels (e.g., corners/edges).
- **Dense Optical Flow**: optical flow computed for every pixel in the frame.
- **Occlusion**: when a tracked object becomes hidden or leaves the frame, breaking simple frame-to-frame matching.
- **Kalman Filter**: an algorithm that predicts an object's next state (e.g., position, velocity) and corrects that prediction using new measurements, robust to occlusion.
- **Hungarian Algorithm**: an algorithm that finds the lowest-cost one-to-one matching between two sets of items (e.g., predicted vs. detected boxes).
- **Velocity**: an object's rate of change of position in a given direction, calculated per axis as $\Delta x / \Delta t$.
- **SORT (Simple Online and Realtime Tracking)**: a tracking algorithm combining the Kalman filter and Hungarian algorithm to maintain object tracks across frames.
- **Object Motion**: the movement of a tracked object itself, as distinct from the camera's own movement.
- **Ego Motion**: the motion of the camera itself, which must be separated out from object motion for accurate 3D tracking.
- **Visual Odometry (VO)**: estimating a camera's own motion (rotation and translation) between frames using only the image sequence, with no external sensors involved.
- **Essential Matrix**: a matrix relating two calibrated camera views to each other from matched 2D points alone, decomposable into the relative rotation and translation between the views.
- **Scale Ambiguity**: the inherent limitation of monocular visual odometry, which recovers the direction of camera translation but not its true magnitude, without an outside reference.
- **Visual-Inertial Odometry (VIO)**: visual odometry fused with IMU measurements to resolve the scale ambiguity of a single camera.
- **Drift**: the accumulation of small pose errors over time in odometry (visual or wheel-based), which compounds because each estimate builds on the previous one without external correction.
- **History Window**: the fixed number of past observed positions given to a trajectory-prediction model as input.
- **Prediction Horizon**: the number of future positions a trajectory-prediction model is asked to forecast.
- **Trajectory Prediction**: forecasting an object's future positions from a history of its past observed positions, without assuming constant velocity or acceleration.
- **Average Displacement Error (ADE)**: the mean prediction error across an entire prediction horizon, one aggregate number per method.
- **Final Displacement Error (FDE)**: the prediction error at just the last step of the horizon - often the more decision-relevant number, since it isolates where a naive extrapolation is wrong the most.
- **Mode Averaging**: the failure mode where a single deterministic model, trained on genuinely ambiguous data (multiple real, distinct outcomes), predicts something close to the average of those outcomes - which may not resemble any outcome that actually occurs.
- **Multi-Hypothesis Prediction**: predicting several distinct candidate future paths at once, each with an associated probability, instead of a single deterministic path.
- **Winner-Take-All Loss**: a training rule for multi-hypothesis models where, per example, only the closest-matching hypothesis head is updated toward the true target, letting different heads specialize into different modes.
- **Hypothesis Collapse**: a failure mode in winner-take-all training where one hypothesis head wins a disproportionate share of examples early on and comes to dominate training, leaving other heads under-trained.
- **minADE-k / minFDE-k**: ADE/FDE computed only against the single closest of a multi-hypothesis model's k predictions, rather than penalizing it for its other, non-matching hypotheses.