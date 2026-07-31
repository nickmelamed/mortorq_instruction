# Linear Algebra Resource Page

The `linear_algebra_primer` teaches just enough linear algebra to understand what's
actually happening inside the ML, CV, and Perception notebooks elsewhere in this
curriculum — and what will happen inside the upcoming Deep Learning and Reinforcement
Learning modules.

## What is Linear Algebra?

Linear Algebra is the math of vectors (ordered lists of numbers) and matrices (grids of
numbers), and the operations you can do with them - adding them, scaling them,
multiplying them together, and using them to transform one set of coordinates into
another.

## Why should I care?

You've already been using linear algebra without a name for it. A camera's rotation and
position (`ml_resources/perception_primer/03-intrinsics-extrinsics.ipynb`), the velocity
of a tracked ball (`ml_resources/perception_primer/05-objects-in-motion.ipynb`), and the
cost matrix that matches predicted boxes to detected ones (same notebook, the Hungarian
Algorithm section) are all vectors and matrices already. A neural network's weights -
covered in `ml_resources/cv_primer/03-neural-networks.ipynb` and about to matter a lot
more in the upcoming Deep Learning module - are matrices too, and "running the network"
is mostly matrix multiplication.

So, this primer isn't introducing a new application - it's giving a name and a set of
rules to math you've already been running inside `numpy` calls, so the modules after
this one (Deep Learning, and the Reinforcement Learning module built on top of it) make
sense as math, not just as code you copy and run. The same is true further out: the
`Q @ K.T` at the center of `genai_architecture_primer`'s attention mechanism and the
distance-to-every-centroid step in `unsupervised_learning_primer`'s K-Means are both
just the "compute every pair at once" pattern from
`03-batches-and-pairwise-operations.ipynb`, not new math either.

## Key Terms

A running glossary of vocabulary introduced across this primer, in the order you'll meet
it.

- **Scalar**: a single number, as opposed to a vector or matrix.
- **Vector**: an ordered list of numbers, e.g. $(x, y)$ or $(x, y, z)$ - can represent a
  point, a direction, or a quantity like velocity.
- **Vector Addition**: combining two vectors component-by-component.
- **Scalar Multiplication**: scaling every component of a vector by the same number.
- **Dot Product**: a single number computed from two vectors that measures how much they
  point in the same direction.
- **Magnitude (Norm)**: the length of a vector, computed from the dot product of a
  vector with itself.
- **Unit Vector**: a vector with magnitude 1, used to represent pure direction with no
  length information.
- **Euclidean Distance**: the straight-line distance between two points, computed as the
  magnitude of the vector between them.
- **Matrix**: a grid of numbers, arranged in rows and columns.
- **Matrix-Vector Product**: applying a matrix to a vector to produce a new vector - the
  core operation behind a **Linear Transformation** (rotating, scaling, or otherwise
  remapping a vector).
- **Matrix Multiplication**: combining two matrices into one that represents applying
  both of their transformations in sequence.
- **Identity Matrix**: the matrix that leaves any vector unchanged when applied to it -
  linear algebra's version of multiplying by 1.
- **Transpose**: a matrix with its rows and columns swapped.
- **Invertibility / Inverse**: a matrix's inverse is the matrix that "undoes" its
  transformation; not every matrix has one.
- **Determinant**: a single number computed from a matrix that tells you (among other
  things) whether that matrix is invertible.
- **Batch**: many vectors stacked together as the rows or columns of a single matrix, so
  the same operation can be applied to all of them in one matrix multiplication instead
  of a loop.
- **All-Pairs Operation**: computing a relationship (a dot product, a distance) between
  every vector in one batch and every vector in another, all at once, via a single
  matrix multiplication or broadcasted expression - rather than a nested loop over every
  pair individually.

## What's in this Primer?

Read these in order:

1. [01 - Vectors](01-vectors.ipynb) - vectors, vector addition, scalar multiplication,
   dot product, magnitude, and distance
2. [02 - Matrices and Transformations](02-matrices-and-transformations.ipynb) - matrices
   as linear transformations, matrix multiplication, identity, transpose, and
   invertibility
3. [03 - Batches and Pairwise Operations](03-batches-and-pairwise-operations.ipynb) -
   naming the "matrix as many stacked vectors" and "compute every pair at once" patterns
   every downstream training loop and attention computation actually relies on

## Where This Goes Next

Everything here is deliberately scoped to "just enough to read the rest of the
curriculum," not a full linear algebra course - there's no eigenvectors, no singular
value decomposition, none of the machinery a full course would build toward (eigenvectors
and eigenvalues are picked up later, in
`ml_resources/unsupervised_learning_primer/02-dimensionality-reduction.ipynb`, exactly
where they're actually needed). If you want that depth, see the Resources section in
each notebook. What you get here is the direct prerequisite for the Deep Learning module
that follows this primer, where a neural network layer turns out to be nothing more than
the matrix-vector product from `02-matrices-and-transformations.ipynb`, run over and
over - and, via `03`, the direct prerequisite for reading `genai_architecture_primer`'s
attention mechanism and `unsupervised_learning_primer`'s K-Means as exactly the same
matrix operations at a larger scale, not new math.
