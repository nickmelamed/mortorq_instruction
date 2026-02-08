# What Is Machine Learning?

Machine Learning (ML) is a subfield of Artificial Intelligence (AI) that focuses on understanding patterns in data via learned functions. 

Essentially, our model typically understands nothing inherently--it doesn't "know" that our goal is to detect balls on the field, for example. But, given data, it will **learn** patterns in that data that allow us to perform that object detection. 


## Key Idea

Since ML models approximate patterns in data, without any prior understanding of the world, there are some key points to remember: 

- Models can be wrong
- Models can be *confidently* wrong
- Models fail outside their training conditions

All of this is to say that we must understand the strengths and limitations of ML to deploy it properly. 

## Why ML in Robotics?

Ideally, ML is a tool we can use to perform things like Perception, or the robot's understanding of the world around it. This takes the form of object detection like finding balls on the field, or avoiding crashing into other robots.

It is important to note that ML is **not** a replacement for good system design; in fact, without strong design principles that dictate how we want our robot to function, the ML model will almost certainly not do what we want it to. So, ML *in conjunction with good system design* can be the foundation of a high-performing robot. 