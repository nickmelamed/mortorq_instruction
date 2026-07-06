# 01 Agent Basics 

## What are Agents? 

**Agents** are systems that perform tasks *autonomously*, meaning they do not require continuous human intervention to perform these tasks. 

### LLM Chatbots vs. Agents

**LLM Chatbots** are meant for conversations powered by Large Language Models (LLMs), which we covered in our AI primer. With chatbots, the purpose is interaction with users.

Agents differ in this respect. While they are still powered by LLMs, they are meant to do more tasks than simply interacting with users. They should be able to *reason* through tasks, meaning they can use rules, logic, and/or algorithms to solve problems, and ideally can perform tasks through multi-step processes. And again, they should be able to do this without human intervention (e.g., "Perform this task").

## How do Agents Perform Tasks? 

### Chatbot Workflow

An interaction with a chatbot typically looks something like this: 

1. User enters prompt
2. Prompt triggers LLM to gather information from its knowledge base. 
3. LLM outputs response 

If this workflow looks relatively simple, it is because it is. The chatbot doesn't do anything behind the scenes without a user input (the prompt). It typically isn't doing tasks, or pulling external information using APIs; it simply provides a response to your question. 

### Agent Workflow

An agent workflow tends to be a little more complex: 

1. User provides overall goal to agent (e.g., "order a replacement drive motor for under $60 before Saturday's competition")
2. Agent analyzes the request, gathering context provided by the goal. 
3. The agent creates a step-by-step plan to execute its goal. 
4. The agent executes its plan using tools, or external information/services (APIs, documentation, etc.), changing files/outcomes as needed. 
5. The agent checks if its plan meets the goal. If not, it tries again. 

Notice how here, the agent does work without being prompted by the user. This is what makes these agents autonomous. Additionally, it goes beyond answering user questions. It will actually change existing files, or place real orders in our example, as necessary. This process likely takes more than one step, making it a multi-step process. 

## Try It

Below is a real-style transcript of an agent handling the goal "order a replacement drive motor for under $60 before Saturday's competition." On paper (or in a text file), write down the letter of each line next to the number of the Agent Workflow step (1-5 above) it belongs to. A step can repeat - the loop in step 5 can send the agent back to step 3 or 4 - and one line can arguably straddle two steps; if so, pick the better fit and note why.

```text
A. User: "Order us a replacement drive motor, under $60, that can arrive before Saturday's
   competition."
B. Agent: Parsing request - part: drive motor, budget: $60 max, deadline: Saturday (2026-07-11).
C. Agent: Plan - (a) search vendors for a compatible drive motor, (b) filter by price and
   shipping time, (c) pick the best option, (d) place the order, (e) confirm to user.
D. Agent: Calling search_parts(part="drive motor", max_price=60)...
E. Tool result: 5 motors found, prices range $45-$95, shipping times range 1-6 days.
F. Agent: Filtering for price <= $60 and arrival by Saturday -> 2 motors remain ($52,
   3-day shipping; $58, 2-day shipping).
G. Agent: Checking against goal - both options satisfy the budget and deadline. Selecting
   the $58 motor for the extra shipping buffer before competition.
H. Agent: Calling order_part(vendor_sku="VEX-775PRO-58", price=58)...
I. Tool result: Order failed - item out of stock, remaining stock now priced at $64.
J. Agent: Checking against goal - $64 exceeds the $60 budget. Plan not yet satisfied,
   re-entering step 4 with the remaining option.
K. Agent: Calling order_part(vendor_sku="REV-PRO-52", price=52)...
L. Tool result: Order confirmed, confirmation #REV-8841.
M. Agent: Checking against goal - ordered, $52 is under $60, and 3-day shipping arrives
   before Saturday. Goal satisfied.
N. Agent to user: "Ordered a REV drive motor, $52, arriving in 3 days (before Saturday).
   Confirmation #REV-8841."
```

Once you've labeled every line, answer in a sentence or two: which single tool-result line, if it had come back different, would have sent the agent back through the loop again - and how do you know from the transcript alone?
