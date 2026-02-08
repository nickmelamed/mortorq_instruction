# Overfitting

## What is Overfitting? 

Overfitting happens when a model memorizes training data instead of learning patterns. 

To better understand what this means, you should think of any dataset you see as a combination of "real" patterns and noise. The patterns are the trends you want to see: the curves that make up a sphere, the yellow color that identifies a ball, etc. Noise can be human error (mismarking a ball), measurement inaccuracies, missing data, inherent randomness (if dealing with probabilistic models), or a ton of other things that don't have anything to do with the actual information we are attempting to understand. 

## How Do we Know Overfitting is Happening?

The most common sign of overfitting is when your training performance (e.g., accuracy) is very strong, but your test performance (or even validation performance) is considerably weaker. 

This tends to happen for a few reasons:
- Noisy data: our data contains many elements of the aforementioned causes of noises, making detecting patterns harder 
- Ambiguous features: in classification, some different classes of objects may be too similar to be classified separately 
- Spurrious Correlations: patterns that don't actually give us insight, yet show up as highly correlated, impact performance. 

## Why is this Hard to Solve? 

Due to something called the bias-variance decomposition, there is a fine balance between being able to minimize bias and variance without raising your MSE. 

Bias (how far off the estimate is from the true value) is usually caused by underfitting, where we had too simplistic of a model to capture the relationships we wanted. Variance (how our model performs on other data) is caused by overfitting, where our model is too complex and captured noise instead of true patterns. 

So, it seems like the key lies in finding the proper amount of parameters in the model that can balance giving us enough complexity (or number of parameters) to estimate a relationship, but not too many that we capture noise. 

We can do this through regularization 

## Regularization 

Regularization penalizes complexity by adding a penalty term that will increase your loss when you add more parameters. Therefore, your model will be limited only to the most important parameters. 

There are different kinds of regularization (L1, L2, Elastic Net), but in lieu of the math behind them, we will focus on acknowledging this tool as a helpful way for us to make sure our model can generalize well. 