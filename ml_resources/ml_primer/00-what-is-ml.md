# What Is Machine Learning?

Machine Learning (ML) is a subfield of Artificial Intelligence (AI) that focuses on understanding patterns in data via learned functions. 

In most cases, our model starts off not knowing anything about our task. It doesn't "know" that our goal is to detect balls on the field, for example. But, given data, it will learn patterns in that data that allow us to perform tasks like object detection.


## Key Idea

Since ML models approximate patterns in data, without any prior understanding of the world, there are some key points to remember. 

For one, models can be wrong, and can also be *confidently* wrong; models can think robots are game pieces, and vice versa. They also fail outside their training conditions. For example, if we didn't train our model on every game piece, it will not recognize every game piece. 

All of this is to say that we must understand the strengths and limitations of ML to deploy it properly. 

## Types of Learning

Not all ML works the same way. There are three broad paradigms to remember.  

### Supervised Learning 

Here, the model learns from labeled examples. We give it the inputs and the correct outputs, and it learns the relationship between them. For example, if we were classifying images of game pieces, our training data would have labels on what was a game piece and what was another team's robot. 

### Unsupervised Learning

Here, the outputs on the training data have no labels. You might wonder why we would ever want unlabeled data. Sometimes, we are hoping to find patterns in data like sensor readings, where we let the model group readings together and based on those groupings, perhaps we find some anomalies that have an underlying reason for occurring. 

### Reinforcement Learning 

In this case, our model is an agent that learns by taking actions in an environment and getting rewarded (or penalized) based on the outcome. This becomes helpful in scenarios like optimal strategy selection, where we know the overall outcome we want (the best strategy) but are unsure of how we can go about finding that best strategy. 

Note that this primer (along with Perception and Computer Vision) focus mainly on supervised learning, since those are most of our tasks in robotics. However, we have individual unsupervised and reinforcement learning primers for those rarer cases. 

## Why ML in Robotics?

Ideally, ML is a tool we can use to perform things like Perception, or the robot's understanding of the world around it. This takes the form of object detection like finding balls on the field, or avoiding crashing into other robots.

It is important to note that ML is **not** a replacement for good system design; in fact, without strong design principles that dictate how we want our robot to function, the ML model will almost certainly not do what we want it to. So, ML in conjunction with good system design can be the foundation of a high-performing robot. 

## Resources

- [Google Machine Learning Crash Course](https://developers.google.com/machine-learning/crash-course) - a free, well-regarded intro course covering the concepts in this primer in more depth.
- [3Blue1Brown: Neural Networks](https://www.3blue1brown.com/topics/neural-networks) - beautifully animated, intuitive visual explanations of how models learn (useful again once you reach the CV primer).
- [*Reinforcement Learning: An Introduction*](http://incompleteideas.net/book/the-book.html) by Sutton & Barto - the standard, freely available textbook on reinforcement learning, one of the three paradigms mentioned above.
- Domingos, P. (2012). "A Few Useful Things to Know about Machine Learning." *Communications of the ACM*, 55(10). A widely cited, accessible paper on practical ML pitfalls, including the "models can be confidently wrong" idea from this notebook.