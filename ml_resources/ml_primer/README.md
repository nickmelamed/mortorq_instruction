# ML Primer 

The `ml_primer` will teach some basic ML concepts that can build our foundation for model-building in the FIRST competition.  

## What is Machine Learning (ML)?

Machine Learning (ML) is the process of finding patterns data via learned functions. ML is a subfield of Artificial Intelligence (AI), which you can think of as creating computational rationality for decision-making under uncertainty. Deep Learning (DL) is a subfield of ML that basically means our functions have more than one "layer". 

If this jargon-heavy explanation didn't make much sense, don't worry! We will explain all of this in more detail. For now, think of ML as finding commonalities/patterns by creating functions based on the data. 

## Why should I care? 

ML is a crucial step in being able to perform complex analysis of data. For robotics specifically, ML gives way to Computer Vision, which is how computers can understand images, and more specifically Perception, which is the ability of the robot to understand its environment. 

So, if you understand these fundamental concepts, you can build a *very* powerful robot. 

## Key Terms

A running glossary of vocabulary introduced across this primer, in the order you'll meet it:

- **Model**: a function that maps inputs to an output.
- **Regression**: predicting a numerical output (e.g., an exam score).
- **Classification**: predicting a categorical output (e.g., ball vs. not ball).
- **Generalizability**: how well a model performs on data it hasn't seen before, not just the data it was trained on.
- **Overfitting**: when a model fits the noise in its training data instead of the true underlying relationship, hurting performance on new data.
- **Underfitting**: when a model is too simple to capture the true underlying relationship, leading to poor performance everywhere.
- **Bias-Variance Tradeoff**: the balance between a model being too simple (high bias/underfitting) and too complex (high variance/overfitting).
- **RMSE (Root Mean Squared Error)**: the standard metric for measuring regression error.
- **Confusion Matrix**: a grid of True/False Positives/Negatives used to evaluate classification.
- **Accuracy / Precision / Recall / F1**: metrics derived from a confusion matrix for evaluating classification performance.
- **Train / Validation / Test Split**: dividing data so a model can be built, tuned, and finally evaluated without cheating.
- **Regularization**: penalizing model complexity during training to reduce overfitting.
- **Cross-Validation**: repeatedly splitting training data into folds to more reliably tune hyperparameters.
- **Hyperparameter Tuning**: the process of searching for the model settings (e.g., regularization strength) that perform best.
- **Gradient Descent**: the iterative, step-by-step process most ML models use to learn their parameters by minimizing a loss function.