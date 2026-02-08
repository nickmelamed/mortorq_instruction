# Tuning 

## Hyperparameters

As mentioned before, we have hyperparameters that serve as figures we can change to control how our model training behaves. Things like learning rate, batch size, etc. can all influence how our training can occur.

Changing these hyperparameters in a systematic way in an attempt to find the optimal model is known as hyperparameter tuning. 

Below we cover a strategy to perform tuning. 

## Tuning Strategy

First, you need to pick the hyperparameters you are interested in changing. Typically, if you can change something, you probably want to try some different values for it. 

Once you've assembled those hyperparameters, you need to have values that you want to try out for each. Typically, these values come from domain knowledge, research papers, educated guesses, etc. You want to have some options because you don't really know which will work best! 

Once you have your possible values and parameters, you are going to run what is essentially a structured guess and check. You can either use all of the combinations of parameters and values (what is known as a grid search), or some of them randomly (random selection, which is more common), and you will run a training loop with each of those combinations. 

It is **crucial** to note that the data you use is your validation dataset, and not the training set. The validation set is used for this purpose, so we can figure out the best hyperparameters! 

The combinations that produce the best metrics of your choice are the ones you will end up using! 

Note that also to perform the tuning, we typically split our validation set using a method called cross-validation, where we split the data into sections and run the loop on each section to remove the chance of random noise influencing our choices.