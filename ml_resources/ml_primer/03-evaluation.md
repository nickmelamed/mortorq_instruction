# Evaluation

Ok, so let's say we've run our training loop, and our loss is minimized because we've run a successful gradient descent algorithm. That must mean our model is good to go, right? 

Unfortunately, minimized loss does not always mean we have good performance on unseen data! It simply means our performance is good on the training data. 

So, how can we define performance on unseen data?

## Metrics

Metrics are a key design choice that programmers have to make. They do depend on your data! Lets go back to our ball detection task. Which one of the below do we think is more important? 

1. Every item that our robot thinks is a ball is actually a ball?
2. How many of the real balls did our robot actually find? 

If you think 1 is more important, then your goal is to see higher precision in your model. If you think 2 is more important, then recall becomes more important. 

There are several common metrics like: 
- Precision
- Recall
- Accuracy

All of which can be useful in a given context depending on our data! 

---

## Model Performance on Unseen Data 

Once you pick a key metric to observe, you want to perform the same task you did on the training data on the test data; we let the model identify balls, and measure its success! 