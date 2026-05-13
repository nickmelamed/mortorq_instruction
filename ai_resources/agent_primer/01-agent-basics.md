# 01 Agent Basics 

## What are Agents? 

**Agents** are systems that perform tasks *autonomously*, meaning they do not require continuous human intervention to perform these tasks. 

### LLM Chatbots vs. Agents

**LLM Chatbots** are meant for conversations powered by Large Language Models (LLMs), which we covered in our AI primer. With chatbots, the purpose is interaction with users.

Agents differ in this respect. While they are still powered by LLMs, they are meant to do more tasks than simply interacting with users. They should be able to *reason* through tasks, meaning they can use rules, logic, and/or algorithms to solve problems, and ideally can perform tasks through multi-step processes. 

## How do Agents Perform Tasks? 

### Chatbot Workflow

An interaction with a chatbot typically looks something like this: 

1. User enters prompt
2. Prompt triggers LLM to gather information from its knowledge base. 
3. LLM outputs response 

If this workflow looks relatively simple, it is because it is. The chatbot doesn't do anything behind the scenes without a user input (the prompt). It typically isn't doing tasks, or pulling external information using APIs; it simply provides a response to your question. 

### Agent Workflow

An agent workflow tends to be a little more complex: 

1. User provides overall goal to agent (e.g., "book flight to NYC for under $300")
2. Agent analyzes the request, gathering context provided by the goal. 
3. The agent creates a step-by-step plan to execute its goal. 
4. The agent executes its plan using tools, or external information/services (APIs, documentation, etc.), changing files/outcomes as needed. 
5. The agent checks if its plan meets the goal. If not, it tries again. 

Notice how here, the agent does work without being prompted by the user. This is what makes these agents autonomous. Additionally, it goes beyond answering user questions. It will actually change existing files, or purchase tickets in our example, as necessary. This process likely takes more than one step, making it a multi-step process. 




   
