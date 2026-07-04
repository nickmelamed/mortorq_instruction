# What Is Machine Learning?

Machine Learning (ML) is a subfield of Artificial Intelligence (AI) that focuses on understanding patterns in data via learned functions. 

Essentially, our model typically understands nothing inherently--it doesn't "know" that our goal is to detect balls on the field, for example. But, given data, it will **learn** patterns in that data that allow us to perform that object detection. 


## Key Idea

Since ML models approximate patterns in data, without any prior understanding of the world, there are some key points to remember: 

- Models can be wrong
- Models can be *confidently* wrong
- Models fail outside their training conditions

All of this is to say that we must understand the strengths and limitations of ML to deploy it properly. 

## Types of Learning

Not all ML works the same way. There are three broad paradigms: 

- **Supervised Learning**: the model learns from labeled examples - we give it inputs *and* the correct outputs (like hours studied and the resulting exam score), and it learns the mapping between them. 
- **Unsupervised Learning**: the model finds structure in data that has no labels (e.g., grouping similar sensor readings together without being told what the groups mean). 
- **Reinforcement Learning**: the model (called an *agent*) learns by taking actions in an environment and getting rewarded or penalized for the outcome. 

This primer - and the Computer Vision/Perception primers that follow it - focus entirely on **supervised learning**, since it's the most common starting point and covers most of what we need for object detection. 

## Why ML in Robotics?

Ideally, ML is a tool we can use to perform things like Perception, or the robot's understanding of the world around it. This takes the form of object detection like finding balls on the field, or avoiding crashing into other robots.

It is important to note that ML is **not** a replacement for good system design; in fact, without strong design principles that dictate how we want our robot to function, the ML model will almost certainly not do what we want it to. So, ML *in conjunction with good system design* can be the foundation of a high-performing robot. 

## Resources

- [Google Machine Learning Crash Course](https://developers.google.com/machine-learning/crash-course) - a free, well-regarded intro course covering the concepts in this primer in more depth.
- [3Blue1Brown: Neural Networks](https://www.3blue1brown.com/topics/neural-networks) - beautifully animated, intuitive visual explanations of how models learn (useful again once you reach the CV primer).
- [*Reinforcement Learning: An Introduction*](http://incompleteideas.net/book/the-book.html) by Sutton & Barto - the standard, freely available textbook on reinforcement learning, one of the three paradigms mentioned above.
- Domingos, P. (2012). "A Few Useful Things to Know about Machine Learning." *Communications of the ACM*, 55(10). A widely cited, accessible paper on practical ML pitfalls, including the "models can be confidently wrong" idea from this notebook.