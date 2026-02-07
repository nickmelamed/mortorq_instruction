# The Training Loop

Training our model is how we teach our model to read patterns. Remember, at this point, the model has never seen any data! 

So, where do we start? 

First, remember when we discussed that we want a "good" model? We discussed generalizability, but how do we quantify what that means? 

The first step in that equation is loss. 

## Loss

Loss is a measure of how wrong our model is. There are several popular metrics like MSE or MAE (Mean Squared Error and Mean Absolute Error), but all of them effectively measure the same idea: we are measuring how far off our model predictions are from the true values. 

In a detection task like finding the yellow balls, you can think of loss as a measure of how frequently our model fail to identify a ball or label something else as a ball. 

Again, don't get caught up in the math behind certain loss functions - we just want to understand what they are for. 

Naturally, our goal is going to be minimizing that loss. We do this via a process called optimization. 

## Optimization 

Optimization is the process of changing model parameters, or the figures that determine how the model maps inputs to outputs, with the goal of minimizing loss. 

To perform optimization, we go through a training loop to gradually adjust our parameters until we reach a desired point (to be discussed shortly). 

## Training Loop Overview

Our training loop is usually going to look something like this: 

1. Take a batch of data
2. Make predictions
3. Measure error (loss)
4. Update the model parameters 
5. Repeat

We put the data into batches for faster processing, and the model updating process happens usually with optimizers, gradient descent, and backpropogation. Don't worry about what these terms mean - you can think of them as tools to help us measure loss and minimize it turn over turn.  

## Key Terms

Some key terms to understand while going through the training loop (these are also known as hyperparameters because we change them ourselves instead of the modeling changing them):

- Epoch: one full pass through the dataset
- Batch size: number of samples per update
- Iteration: one update step
- Learning rate: how large that step is (i.e., how much of a change do we make to our model parameters)

Typically, we pick different numbers for each of these to run our training loop with to see what yields best performance. 

For each individual loop, they stop once the number of pre-set iterations is reached, and we pick the parameters that give us the lowest loss. 

Remember that training is **iterative refinement**, not magic. This gives us some confidence that our model is learning patterns in the data! 