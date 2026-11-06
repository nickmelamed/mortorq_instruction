# Perception Resource Page 

The `perception_primer` will teach some basic Computer Vision concepts that will build a foundation for us to understand the higher-level Perception concepts for object detection. Its last three notebooks go a step further, into the decision-making layer (Planning) that turns a detection or a predicted trajectory into an actual robot action, plus the vocabulary to connect all of it to how the wider autonomous-vehicle industry talks about the same problems.

## What is Perception?

In robotics, Perception refers to the ability of the robot to use sensors to gather data about its internal state as well as its environment. This information is ultimately processed through various algorithms to fuel autonomous action, like through out AutoPaths, for instance. 

## Why should I care? 

Perception fuels every action of our robot, from estimating position on the field by reading in AprilTags from Limelights, to using CANRange to estimate intake capacity. All of these fall under the field of Perception. Since this field is so vast, our focus is going to be understanding some key concepts in Perception to build a deeper understanding of how our robots can process information. 

By the end of this primer, that understanding extends past what the robot sees and into what the robot does, whether that's auto-aligning to a scoring target mid-teleop, or steering clear of another robot whose path we've forecast. 

This is also, not coincidentally, the same problem self-driving cars solve at a much larger scale.

## Key Terms

A running glossary of vocabulary introduced across this primer, in the order you'll meet it. See also the [ml_primer](../ml_primer/README.md) and [cv_primer](../cv_primer/README.md) glossaries for foundational terms like model, regression, classification, and camera intrinsics, which this primer builds on directly, and the [linear_algebra_primer](../linear_algebra_primer/README.md) glossary for the vector/matrix vocabulary (Rotation Matrix, Translation Matrix, Euclidean distance) this primer's pose-estimation and tracking math is built from. `06-trajectory-prediction.ipynb` additionally builds directly on the [deep_learning_primer](../deep_learning_primer/README.md)'s Regression Head and backpropagation. `07-multi-hypothesis-prediction.ipynb` further builds on the Classification Head/softmax machinery from `deep_learning_primer/02` and the same cross-entropy-shaped gradient used in [rl_primer](../rl_primer/README.md)'s `02-policy-gradients.ipynb`. `08-decision-making.ipynb` builds directly on `back_end_resources/systems_primer/03_state_machines`' state/transition vocabulary and `04_control_loops_pid`/`04b_motion_control_and_trajectories`'s PID and Pure Pursuit machinery, and consumes `07`'s multi-hypothesis output directly. `09-planning-and-av-context.ipynb` builds on `08`'s state machine and collision-checking and doesn't require anything new beyond what's already listed above. `10-full-autonomy-stack.ipynb` combines `09`'s planners and reactive layer with `04b`'s Pure Pursuit tracker, and uses `05`'s tracked-velocity idea for prediction.

- **Loss**: the metric used to guide model training (e.g., minimized during fitting).
- **Performance**: the metric(s) used to evaluate a trained model's results, which may or may not be the same as the loss.
- **Binary Cross Entropy (BCE) Loss**: the standard loss function for binary classification, based on predicted probabilities.
- **Accuracy**: the proportion of all predictions a model got correct. It is misleading on imbalanced datasets.
- **Specificity / True Negative Rate (TNR)**: out of all true-negative cases, the proportion correctly predicted negative.
- **F1 Score**: the harmonic mean of precision and recall, balancing the two into a single metric.
- **Object Detection**: the combined task of classifying an object and localizing it within a frame.
- **Localization**: determining where an object is within a frame, typically via a bounding box.
- **Bounding Box**: a rectangle, defined by coordinates and a height/width, marking where an object is located in an image.
- **Ground Truth**: the manually- or expert-verified "true" label or bounding box a prediction is compared against.
- **Intersection over Union (IoU)**: the ratio of overlap area to total area between a predicted and ground-truth bounding box, used to score localization accuracy.
- **YOLO (You Only Look Once)**: a family of object detection models that treats detection as a single regression problem over the whole image, rather than first proposing regions.
- **Non-Maximum Suppression (NMS)**: the post-processing step that collapses multiple overlapping candidate boxes for the same object down to one, keeping the highest-confidence box and suppressing others whose IoU with it exceeds a threshold.
- **Average Precision (AP) / Mean Average Precision (mAP)**: AP is the area under a detector's precision-recall curve for one class at a fixed IoU threshold; mAP is the average of AP across every class, the standard metric reported at the end of a detection training run.
- **Intrinsic Matrix ($K$)**: the matrix encoding a camera's focal length(s) and principal point, used to map camera-coordinate points to pixel coordinates.
- **Lens Distortion**: the deviation of a real lens from the ideal pinhole model $K$ describes, which bends straight lines into curves (radial distortion) or introduces a small skew (tangential distortion); solved for by `cv2.calibrateCamera` alongside $K$, and corrected internally by a calibrated vision pipeline like a Limelight before pixels are ever reported.
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
- **Visual-Inertial Odometry (VIO)**: visual odometry fused with IMU measurements: the IMU's accelerometer supplies the metric distance that a single camera can't, and vision corrects the IMU's fast-growing drift.
- **Loosely vs. Tightly Coupled Fusion**: loosely coupled fusion blends sensors' finished pose estimates in a filter; tightly coupled fusion feeds the raw measurements (e.g. IMU readings and tracked feature points) into one estimator that solves for everything at once, which is more accurate but much more complex.
- **Drift**: the accumulation of small pose errors over time in odometry (visual or wheel-based), which compounds because each estimate builds on the previous one without external correction.
- **RANSAC (Random Sample Consensus)**: a robust model-fitting algorithm that repeatedly fits a candidate model to a small random subset of points and keeps whichever candidate the largest "consensus set" of other points also agrees with, rejecting outlier correspondences without needing to know in advance which ones they are.
- **Sensor Fusion**: combining multiple sources of state information (e.g. wheel odometry (continuous but biased) and vision (intermittent but unbiased)) into a single estimate, weighted by how much each source is currently trusted, rather than trusting only one at a time.
- **History Window**: the fixed number of past observed positions given to a trajectory-prediction model as input.
- **Prediction Horizon**: the number of future positions a trajectory-prediction model is asked to forecast.
- **Trajectory Prediction**: forecasting an object's future positions from a history of its past observed positions, without assuming constant velocity or acceleration.
- **Average Displacement Error (ADE)**: the mean prediction error across an entire prediction horizon, one aggregate number per method.
- **Final Displacement Error (FDE)**: the prediction error at just the last step of the horizon - often the more decision-relevant number, since it isolates where a naive extrapolation is wrong the most.
- **Recurrent Neural Network (RNN)**: a network that reads a sequence one step at a time, carrying a hidden state forward, with the same weights reused at every step so it can read a history of any length.
- **Hidden State**: the fixed-size vector a recurrent network carries from step to step, meant to summarize everything it has seen so far.
- **Vanishing Gradient**: the failure mode where the gradient reaching early time steps shrinks exponentially (it's a product of many Jacobians with magnitude below 1), so a plain RNN can barely learn from the distant past.
- **Long Short-Term Memory (LSTM)**: a recurrent cell that adds a separately, additively-updated cell state controlled by forget, input, and output gates, letting gradients survive much longer sequences.
- **Gated Recurrent Unit (GRU)**: a streamlined gated recurrent cell with two gates and no separate cell state; typically performs close to an LSTM at lower cost.
- **Social Pooling**: summarizing a variable number of unordered neighboring agents into one fixed-size vector (embed each neighbor with shared weights, then pool with an order-independent operation like max), so a trajectory model can account for other agents without caring how many there are or what order they're listed in.
- **Agent-Time Token**: one token per agent per time step ("defender 2 at step 9"), which lets a Transformer attend across both who and when at once instead of processing steps in sequence.
- **Padding Mask**: a mask that sets the attention scores of empty token slots (e.g. absent defenders) to negative infinity before the softmax, so they get exactly zero attention weight.
- **Mode Averaging**: the failure mode where a single deterministic model, trained on genuinely ambiguous data (multiple real, distinct outcomes), predicts something close to the average of those outcomes, which may not resemble any outcome that actually occurs.
- **Multi-Hypothesis Prediction**: predicting several distinct candidate future paths at once, each with an associated probability, instead of a single deterministic path.
- **Winner-Take-All Loss**: a training rule for multi-hypothesis models where, per example, only the closest-matching hypothesis head is updated toward the true target, letting different heads specialize into different modes.
- **Hypothesis Collapse**: a failure mode in winner-take-all training where one hypothesis head wins a disproportionate share of examples early on and comes to dominate training, leaving other heads under-trained.
- **minADE-k / minFDE-k**: ADE/FDE computed only against the single closest of a multi-hypothesis model's k predictions, rather than penalizing it for its other, non-matching hypotheses.
- **Perception -> Prediction -> Planning -> Control**: the four-stage pipeline every real autonomous system (FRC or otherwise) is structured around; this primer's earlier notebooks build Perception and Prediction, `08` builds Planning, and Control is already covered in `back_end_resources/systems_primer`.
- **Planning**: the pipeline stage that decides what a robot should do next, given perception's "what's out there" and prediction's "where is it going."
- **Shared Control**: a system in which both a human and an autonomous behavior influence the outcome, rather than either one having sole control - FRC's teleop-with-vision-assist pattern (e.g. auto-align) is a concrete instance.
- **Collision-Checking**: testing whether a candidate path is likely to intersect a predicted trajectory within a safety radius, weighted by that hypothesis's probability for a multi-hypothesis prediction.
- **Expected Collision Probability**: the sum of the probabilities of every predicted hypothesis a candidate path collides with - a single number a planner can threshold a decision against.
- **Occupancy Grid**: a discretized representation of a space (e.g. the field) as occupied or free cells, built from tracked object positions and used as input to a path-checker or replanner.
- **Replanning**: searching for a new path once a planned one is found to be blocked.
- **A\* (A-Star)**: a search-based path-planning algorithm that finds the lowest-cost path through a graph (e.g. an occupancy grid), guaranteed to find the shortest free path if one exists.
- **RRT (Rapidly-Exploring Random Tree)**: a sampling-based path-planning algorithm that grows a tree of reachable points outward from a start until it reaches a goal, scaling better than A\* to large or high-dimensional spaces at the cost of optimality guarantees.
- **Curse of Dimensionality**: the way a grid search's cost multiplies with every state variable added (position, then heading, then time, then speed...), because the number of cells is the product of the cells along each axis.
- **Hybrid A\***: a search-based planner that keeps A\*'s lowest-cost-first search but uses drivable arcs as successors instead of neighboring grid cells, with a grid used only to decide whether a (position, heading) has already been visited; a standard tool for heading-constrained robots and vehicles.
- **Dubins Path**: the shortest path between two poses (position and heading) for a robot that only drives forward and has a minimum turning radius; always one of six shapes made of left arcs, right arcs, and straight lines (LSL, RSR, LSR, RSL, RLR, LRL).
- **Two-Point Boundary-Value Problem**: finding the path that starts at one specified state, ends at another, and obeys the robot's motion constraints throughout; the exact connection step that RRT\* needs, and which only has a closed-form answer for simple robot models like the Dubins car.
- **RRT\***: a variant of RRT that, after adding each new node, picks the cheapest nearby parent for it and then offers it to its neighbors as a cheaper parent ("rewiring"), so the path keeps improving the longer it runs and converges toward the optimum.
- **Probabilistic Completeness**: the guarantee that a sampling-based planner will eventually find a path if one exists, given enough samples; weaker than a grid search's guarantee, since it can never report that no path exists.
- **Shortcutting / Path Smoothing**: post-processing for a raw sampling-based path; shortcutting deletes stretches of path wherever a direct link between two non-adjacent points is allowed, and smoothing (e.g. corner cutting) rounds off whatever corners remain, re-checking that nothing becomes illegal.
- **Artificial Potential Field**: a reactive planning approach that treats a goal as attracting a robot and obstacles as repelling it, summing the resulting forces into a movement direction at every instant.
- **Local Minimum**: a potential field's characteristic failure mode, where forces from multiple obstacles cancel out and leave the robot stuck even though the goal is still far away.
- **SAE Levels of Automation**: the Society of Automotive Engineers' six-level (L0-L5) scale describing how much of a driving task is automated, from no automation to full automation under all conditions.
- **Operational Design Domain (ODD)**: the specific set of conditions (environment, geography, lighting, etc.) an autonomous system is actually designed and validated to operate within.
- **Autonomy Stack**: the layered system an autonomous robot is built from, where each layer answers a different question at a different speed (here: a global planner, a path tracker, a reactive layer, and a supervisor).
- **Global Planner**: the slow, far-looking layer that proposes a whole route to the goal (e.g. Hybrid A\* or RRT\*), run rarely instead of every tick.
- **Path Tracker**: the fast layer that turns a planned path into steering commands every tick (e.g. Pure Pursuit).
- **Reactive Layer**: the cheap, fast layer that keeps the robot out of trouble moment to moment regardless of the plan (e.g. a potential field), and which can stall in a local minimum.
- **Supervisor**: the layer that watches the others and decides when the global plan can no longer be trusted and a replan is needed, using both proactive triggers (the path ahead is blocked) and fallback ones (progress has stalled).
- **Risk-Aware Planning**: building the planner's picture of the world from predicted futures weighted by their probability, so each cell of an occupancy grid holds a probability of being in the way and counts as blocked above a chosen threshold; a lower threshold is more cautious, and a planner can relax it step by step if caution leaves no path at all.
- **Sensing Delay**: the age of a measurement by the time the stack receives it, so the world has already moved on; usually handled by rolling the estimate forward to the present with the motion model.
- **Actuator Lag**: the gradual response of a drivetrain to a command, so the robot keeps doing something close to the previous command for a moment; destabilizes path tracking in a way that sensing delay does not.
- **Holonomic Drive**: a drivetrain that can move in any direction and rotate independently (e.g. swerve), so planning needs only position, heading can be handled separately, and a reactive layer can simply add a repulsive velocity instead of steering around.