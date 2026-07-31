# Reinforcement Learning Resource Page

The `rl_primer` is where the two previous primers stop being separate ingredients and
become one system. `deep_learning_primer/02-value-and-policy-networks.ipynb` built a
**Value Network** and a **Policy Network**, and ended on the same open question twice:
*what do you actually train these on, if not a fixed label?* This primer answers that
question, and in doing so, builds the core piece of this team's stated strategic
direction: using a value/policy network as a function approximator to recommend
alliance-pick strategy from scouting data.

## What is Reinforcement Learning?

Recall the one-line definition from `ml_resources/ml_primer/00-what-is-ml.md`:
*"Reinforcement Learning: the model (called an agent) learns by taking actions in an
environment and getting rewarded or penalized for the outcome."* This primer formalizes
that: an **agent** observes a **state**, takes an **action**, and receives a **reward**
- and, critically, the *consequences* of an action might not show up as a reward until
several steps later. Learning which action was actually responsible for a reward that
arrived steps afterward is the central problem this primer is about.

## Why should I care?

FRC alliance selection is a genuine sequential decision problem, not a single lookup:
a captain drafts a first partner, *then* a second, and the value of the second pick
depends entirely on what the first pick already covers (recall
`frc_resources/01_frc_intro/README.md`'s description of the draft). Whether the whole
alliance turns out well isn't knowable until after both picks are locked in - the
reward for "was pick 1 a good idea" is delayed until you see how pick 2 rounds it out.
That's exactly the structure Reinforcement Learning is built to handle, and exactly
the structure a one-shot supervised regression (guess a score for one team, in
isolation) can't capture.

## Key Terms

A running glossary of vocabulary introduced across this primer, in the order you'll
meet it. See also the
[deep_learning_primer](../deep_learning_primer/README.md) glossary for Value Network,
Policy Network, Regression Head, and Classification Head, which this primer trains for
the first time using a real reward signal instead of a fixed label.

- **Agent**: the decision-maker - recall this term from `ai_resources/agent_primer`,
  used here in the original, narrower sense that name comes from.
- **Environment**: everything the agent's actions affect and that affects the agent
  back - here, the pool of remaining draftable teams and the alliance being built.
- **State**: everything the agent currently knows that's relevant to deciding its next
  action.
- **Action**: a choice the agent can make from a given state.
- **Reward**: a number the environment returns after an action, indicating how good
  that action's immediate outcome was.
- **Episode**: one complete run from a starting state to a terminal state (here, one
  full draft: first pick through second pick).
- **Return**: the total accumulated reward over an episode, from a given point
  forward.
- **Discount Factor ($\gamma$)**: a number between 0 and 1 that reduces the weight of
  rewards the further in the future they occur, when computing return.
- **Markov Decision Process (MDP)**: the formal name for the state/action/reward/
  environment structure this primer assumes.
- **Policy ($\pi$)**: a strategy - a rule (possibly probabilistic) for choosing an
  action given a state.
- **Value Function ($V$)**: the expected return starting from a given state, assuming
  the agent follows its current policy from there on.
- **Action-Value Function (Q-Value)**: the expected return from taking a specific
  action in a specific state, then following the policy afterward.
- **Temporal Difference (TD) Learning**: updating a value estimate using another,
  later value estimate as a stand-in for the true (unknown) final return, rather than
  waiting for the episode to end.
- **TD Error**: the gap between a value estimate and the (partially bootstrapped)
  target TD learning updates it toward.
- **Q-Learning**: a specific TD algorithm that learns Q-values directly, and always
  bootstraps toward the *best* available next action.
- **Exploration vs. Exploitation**: the tension between trying an action to learn more
  about it (exploration) and taking the action currently believed to be best
  (exploitation).
- **Epsilon-Greedy**: a simple exploration strategy - act greedily (exploit) most of
  the time, but act randomly (explore) with small probability $\epsilon$.
- **Deep Reinforcement Learning**: Reinforcement Learning where the value function
  and/or policy is represented by a neural network (a **Value Network** / **Policy
  Network**) instead of a lookup table, so it can generalize to states it has never
  exactly seen before.
- **Experience Replay**: collecting a batch of past transitions and training on all of
  them together (recomputing bootstrapped targets each round) instead of updating a
  network from one single, noisy transition at a time - real Deep Q-Networks use this
  because single-transition updates chase a constantly-shifting target and destabilize
  easily.
- **Policy Gradient**: a family of methods that adjust a Policy Network's weights
  directly, increasing the probability of actions that led to above-average reward and
  decreasing the probability of those that led to below-average reward.
- **Baseline**: a reference reward level (e.g. a running average) that policy gradient
  compares each episode's reward against, to reduce noise in the update.

## What's in this Primer?

Read these in order:

1. [01 - MDPs and Value-Based Learning](01-mdps-and-value-based-learning.ipynb) -
   framing the FRC draft as an MDP, tabular Q-learning, and the jump to a Value
   Network when the state space gets too large to tabulate
2. [02 - Policy Gradients](02-policy-gradients.ipynb) - training a Policy Network
   directly from a reward signal, and why the update turns out to be an ordinary
   classification loss in disguise

## Where This Goes Next

Everything in this primer trains a network; nothing in it deploys one. Once a value or
policy network is trained, it becomes exactly the kind of thing
`ai_resources/agent_primer/04-tool-use-and-function-calling.md` already describes: a
real function the agent can call, with a name and a description the model uses to
decide when to reach for it. Its recommendation still isn't something that should
reach the drive team unreviewed - it goes through the same approval gate every other
scouting-agent recommendation does, per
`ai_resources/agent_primer/10-human-in-the-loop-design.md`. Wiring that connection up
for real - the tool schema, which worker owns the inference call, what the observability
trace needs that a rule-based tool didn't - is covered in
`ai_resources/agent_primer/13-integrating-a-trained-model.md`, an extension of the
existing `agent_primer` capstone rather than new content in this primer.
