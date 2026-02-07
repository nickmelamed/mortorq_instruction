# 01 – Models and Data

A model is a function:

input -> output

The model’s job is to **map inputs to useful outputs**.

---

## The Data Is the Model

Bad data guarantees bad models.

The model will only be as good as our data is. But more importantly, what does "good" actually mean? 

## Generalizability

Ideally, our model is going to perform well on *any* data that is related to our task. For example, with the ball detection, we don't want our model to just be good at detecting balls on our own field; we want it to be able to detect the on any competition field! 

The key to that is making a model that is generalizable, or one that performs well on unseen data (like the new competition fields). To do that, we split our data into groups to verify that our model is not simply becoming good at detecting patterns in the training data, but in any data we present it. 

## Dataset Splits

- Training: model learns patterns
- Validation: tune decisions
- Test: final evaluation

Some common percentage splits are 60% training, 20% validation, 20% test, or 50-30-20, etc. The specific numbers you use are not too crucial, as the differences tend to be rather small. 

Never use test data to tune the model, otherwise you have what is called "data leakage" and your model "cheats" by seeing the data it is not supposed to see and therefore we don't actually test it on unseen data! 