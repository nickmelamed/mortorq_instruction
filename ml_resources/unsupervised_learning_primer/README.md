# Unsupervised Learning Resource Page

`ml_resources/ml_primer/00-what-is-ml.md` named all three ML paradigms - supervised,
unsupervised, and reinforcement learning - then said *"this primer... focuses entirely on
supervised learning."* Every notebook since then, across `cv_primer`, `perception_primer`,
`deep_learning_primer`, and `rl_primer`, has needed a label or a reward signal to train
against. This primer is where that assumption finally gets dropped: every technique here
finds structure in data with **no labels at all**.

## What is Unsupervised Learning?

Recall the one-line definition from `ml_primer/00-what-is-ml.md`: *"the model finds
structure in data that has no labels - e.g., grouping similar sensor readings together
without being told what the groups mean."* This primer covers four concrete ways to do
that: grouping similar things together, compressing many features down to the ones that
actually matter, learning a compressed representation by reconstructing your own input,
and flagging what doesn't fit any of the above.

## Why should I care?

A season's worth of scouting data has structure nobody hand-labeled: teams that play
similar roles, stats that move together, and the occasional entry that's either a
scouting mistake or a team having a genuinely unusual match. `ai_resources/agent_primer/
08-guardrails-failure-modes-and-eval.md` already told you a good agent should "report the
gap instead of guessing" when data looks wrong - two notebooks in this primer
(`03-autoencoders.ipynb`, `04-anomaly-detection.ipynb`) build the actual technique for
noticing that gap in the first place.

## Key Terms

A running glossary of vocabulary introduced across this primer, in the order you'll meet
it. See also the [ml_primer](../ml_primer/README.md) glossary for Model, Supervised
Learning, and Unsupervised Learning, and the
[linear_algebra_primer](../linear_algebra_primer/README.md) glossary for Matrix-Vector
Product and Euclidean Distance, which `02-dimensionality-reduction.ipynb` extends with
Eigenvectors and Eigenvalues - deliberately left out of `linear_algebra_primer` as more
than "just enough," and picked up here where they're actually needed.

- **Cluster**: a group of data points that are more similar to each other than to points
  outside the group.
- **Centroid**: the center point of a cluster - in K-Means, the mean of every point
  currently assigned to it.
- **K-Means**: a clustering algorithm that assigns each point to its nearest centroid,
  then recomputes centroids as the mean of their assigned points, repeating until
  assignments stop changing.
- **Inertia**: the sum of squared distances from each point to its assigned centroid -
  K-Means' own internal measure of how tightly it's grouped the data.
- **Dimensionality Reduction**: representing data with fewer features than it started
  with, while preserving as much meaningful structure as possible.
- **Variance**: how spread out a set of values is - the quantity Principal Component
  Analysis tries to preserve as much of as possible when reducing dimensions.
- **Covariance Matrix**: a matrix summarizing how every pair of features in a dataset
  varies together.
- **Eigenvector**: a direction that a matrix only stretches or shrinks, never rotates -
  the directions of maximum variance a Covariance Matrix's eigenvectors point along.
- **Eigenvalue**: the amount an eigenvector gets stretched by - for a Covariance Matrix,
  how much variance lies along that eigenvector's direction.
- **Principal Component Analysis (PCA)**: dimensionality reduction that projects data
  onto the top eigenvectors of its covariance matrix - the directions carrying the most
  variance.
- **Explained Variance Ratio**: the fraction of a dataset's total variance captured by
  keeping a given set of principal components.
- **Autoencoder**: a neural network trained to reconstruct its own input, forced through
  a narrower **Bottleneck** layer in the middle - unsupervised, since the "label" is just
  the input itself.
- **Bottleneck**: an autoencoder's narrowest hidden layer - the compressed
  representation the network is forced to learn, if it wants to reconstruct its input
  well.
- **Reconstruction Error**: the difference between an autoencoder's output and its
  original input - low for data that looks like what it was trained on, high for data
  that doesn't.
- **Anomaly Detection**: identifying data points that don't fit the pattern the rest of
  the data follows.
- **Anomaly Score**: a single number representing how unusual a given data point is,
  used to rank or threshold candidates for review.

## What's in this Primer?

Read these in order:

1. [01 - Clustering](01-clustering.ipynb) - K-Means from scratch, first on synthetic
   data, then grouping scouted teams into playstyles
2. [02 - Dimensionality Reduction](02-dimensionality-reduction.ipynb) - PCA from
   scratch, introducing eigenvectors/eigenvalues for the first time in this curriculum
3. [03 - Autoencoders](03-autoencoders.ipynb) - a neural network that learns to
   compress and reconstruct its own input, with no labels at all
4. [04 - Anomaly Detection](04-anomaly-detection.ipynb) - using reconstruction error
   (and simpler statistical methods) to flag scouting data or opponent behavior that
   doesn't fit the pattern

## Where This Goes Next

`04-anomaly-detection.ipynb` closes a loop back to `ai_resources/agent_primer/08-
guardrails-failure-modes-and-eval.md`'s call for an agent that "reports the gap instead
of guessing" when data looks wrong - a real, concrete technique for deciding *when*
something looks wrong in the first place, rather than a vague instinct to distrust
outliers.
