# Linear Algebra Resource Page

The `linear_algebra_primer` teaches just enough linear algebra to understand what's
actually happening inside the other notebooks in `ml_resources`.

## What is Linear Algebra?

Linear Algebra is the math of vectors (ordered lists of numbers) and matrices (grids of
numbers), and the operations you can do with them. These include adding them, scaling them, multiplying them together, and using them to transform one set of coordinates into another.

## Why should I care?

You've already been using linear algebra. A camera's rotation and
position (`ml_resources/perception_primer/03-intrinsics-extrinsics.ipynb`), the velocity of a tracked ball (`ml_resources/perception_primer/05-objects-in-motion.ipynb`), and the cost matrix that matches predicted boxes to detected ones (same notebook, the Hungarian algorithm section) are all vectors and matrices already. A neural network's weights (covered in `ml_resources/cv_primer/03-neural-networks.ipynb`) are matrices too, and "running the network" is mostly matrix multiplication.

So, this primer isn't introducing a new application; it's about providing names and understanding to the underlying math so you understand the theoretical rationale of all these formulas you read.  

## Key Terms

A running glossary of vocabulary introduced across this primer, in the order you'll meet it.

- **Scalar**: a single number, as opposed to a vector or matrix.
- **Vector**: an ordered list of numbers, e.g. $(x, y)$ or $(x, y, z)$. It can represent a point, a direction, or a quantity like velocity.
- **Vector Addition**: combining two vectors component-by-component.
- **Scalar Multiplication**: scaling every component of a vector by the same number.
- **Dot Product**: a single number computed from two vectors that measures how much they
  point in the same direction.
- **Magnitude (Norm)**: the length of a vector, computed from the dot product of a
  vector with itself.
- **Unit Vector**: a vector with magnitude 1, used to represent pure direction with no length information.
- **Euclidean Distance**: the straight-line distance between two points, computed as the magnitude of the vector between them.
- **Matrix**: a grid of numbers, arranged in rows and columns.
- **Matrix-Vector Product**: applying a matrix to a vector to produce a new vector; the core operation behind a **Linear Transformation** (rotating, scaling, or otherwise remapping a vector).
- **Matrix Multiplication**: combining two matrices into one that represents applying
  both of their transformations in sequence.
- **Elementwise Multiplication**: multiplying two same-shaped arrays position-by-position (`*` in NumPy). It is a completely different operation from the matrix product (`@`), despite the visual similarity.
- **Identity Matrix**: the matrix that leaves any vector unchanged when applied to it. It is linear algebra's version of multiplying by 1.
- **Transpose**: a matrix with its rows and columns swapped.
- **Invertibility / Inverse**: a matrix's inverse is the matrix that "undoes" its
  transformation; not every matrix has one.
- **Determinant**: a single number computed from a matrix that tells you (among other
  things) whether that matrix is invertible.
- **Eigenvector / Eigenvalue**: a direction a matrix only stretches or shrinks without turning, and the factor it is scaled by. Introduced briefly here; used in earnest for PCA.
- **Batch**: many vectors stacked together as the rows or columns of a single matrix, so the same operation can be applied to all of them in one matrix multiplication instead of a loop.
- **Broadcasting**: NumPy automatically stretching a smaller array across a larger one when their shapes are compatible, so operations like adding a single bias to every column of a batch work without writing a loop.
- **All-Pairs Operation**: computing a relationship (a dot product, a distance) between every vector in one batch and every vector in another, all at once, via a single matrix multiplication or broadcasted expression. It does so rather than a nested loop over every pair individually.

## What's in this Primer?

Read these in order:

1. [01 - Vectors](01-vectors.ipynb) - vectors, vector addition, scalar multiplication, dot product, magnitude, and distance
2. [02 - Matrices and Transformations](02-matrices-and-transformations.ipynb) - matrices as linear transformations, matrix multiplication (shape rules, and how it differs from elementwise multiplication), identity, transpose, invertibility, and eigenvectors/eigenvalues as the directions a matrix only stretches
3. [03 - Batches and Pairwise Operations](03-batches-and-pairwise-operations.ipynb) -
naming the "matrix as many stacked vectors," "broadcasting," and "compute every pair at once" patterns every downstream training loop and attention computation actually relies on

## Where This Goes Next

This isn't a full linear algebra course. There's no singular
value decomposition; eigenvectors and eigenvalues are briefly mentioned later, in
`ml_resources/unsupervised_learning_primer/02-dimensionality-reduction.ipynb`. If you want that depth, see the Resources section in each notebook. What you get here is the direct prerequisite for all the notebooks we talked about above.
