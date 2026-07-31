# Deep Learning Resource Page

The `deep_learning_primer` picks up where `cv_primer/03-neural-networks.ipynb` left off.
That notebook built neurons and layers, and trained them with `sklearn`'s
`MLPClassifier` - a real neural network, but one where `.fit()` did all the actual
learning as a black box, on image data. This primer opens that box, and points the
result somewhere other than images: at the same kind of structured, tabular data
(team stats, match features) that `ml_primer` used, since that's the shape of a state
you'd feed to the Reinforcement Learning module that follows this one.

## What is Deep Learning?

Recall from `ml_primer/README.md`: "Deep Learning (DL) is a subfield of ML that
basically means our functions have more than one layer." This primer covers two things
`ml_primer` and `cv_primer` didn't need yet: how a multi-layer network actually learns
(**backpropagation** - what's running inside that `.fit()` call), and how the *shape*
of a network's last layer determines what kind of question it's answering.

## Why should I care?

The current plan for this team's scouting agent (`ai_resources/agent_primer`) is to
extend it with a **value network** or **policy network** - a neural network used as a
**function approximator** that takes in scouting data and outputs an alliance-pick
recommendation, trained with Reinforcement Learning. Both of those are ordinary neural
networks with one specific design choice made about their output layer. This primer is
what makes that design choice legible before the RL primer asks you to make it.

## Key Terms

A running glossary of vocabulary introduced across this primer, in the order you'll
meet it. See also the [cv_primer](../cv_primer/README.md) glossary for Neuron, Layer,
and Activation Function, and the
[linear_algebra_primer](../linear_algebra_primer/README.md) glossary for Matrix-Vector
Product, which this primer's forward and backward passes are built from directly.

- **Function Approximation**: using a model (here, a neural network) to approximate an
  unknown mapping from inputs to outputs, given only example input/output pairs.
- **Forward Pass**: computing a network's output by running an input through every
  layer in sequence.
- **Backward Pass (Backpropagation)**: computing how much each weight in the network
  contributed to the final error, by working backward from the output layer to the
  input layer one layer at a time.
- **Chain Rule**: the calculus rule backpropagation is built from - the derivative of a
  composition of functions is the product of each function's derivative.
- **Loss Gradient**: the direction and rate at which a small change in a given weight
  changes the loss; what gradient descent uses to decide how to update that weight.
- **Epoch**: one full pass of gradient descent updates over the entire training
  dataset.
- **Output Head**: the final layer of a network, whose size and activation determine
  what kind of answer the network gives.
- **Regression Head**: an output head with a single number and no squashing
  activation, used when the answer is a continuous quantity.
- **Logits**: a classification network's raw, pre-probability output values - can be
  any real number, before being converted into probabilities.
- **Softmax**: a function that converts a vector of logits into a probability
  distribution (all values between 0 and 1, summing to 1).
- **Classification Head**: an output head with one number per category, passed
  through softmax, used when the answer is "which of these options."
- **Value Network**: a neural network whose output head is a Regression Head
  producing a single number estimating how good a given state is.
- **Policy Network**: a neural network whose output head is a Classification Head
  producing a probability distribution over possible actions to take in a given
  state.

## What's in this Primer?

Read these in order:

1. [01 - Backpropagation and Function Approximation](01-backpropagation-and-function-approximation.ipynb) -
   opening the black box: building and training a small multi-layer network from
   scratch (no `sklearn`), on tabular data instead of images
2. [02 - Value and Policy Networks](02-value-and-policy-networks.ipynb) - the same
   network body, with two different output heads, previewing the two shapes the
   Reinforcement Learning primer will train

## Where This Goes Next

This primer stops right before the interesting part on purpose: nothing here trains on
a reward signal, and nothing here makes a decision that gets acted on. A value network
and a policy network, as built here, are architecturally no different from the
regression and classification networks already covered in `ml_primer` and `cv_primer`
- what makes them "RL" is *what you train them on and what you do with their output*,
which is exactly where the next primer picks up.
