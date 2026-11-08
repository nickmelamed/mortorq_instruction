# Reinforcement Learning Resource Page

`deep_learning_primer/02-value-and-policy-networks.ipynb` built a
**Value Network** and a **Policy Network**, and ended on the same open question twice.
what do you actually train these on, if not a fixed label? This primer answers that
question, and in doing so, builds a core piece of this team's stated strategic
direction: using a value/policy network as a function approximator to recommend
alliance-pick strategy from scouting data. It also covers the other place a learned
policy could go on a robot, which is the driving itself: learning from a driver or a
planner, learning to navigate when the planner's model of the world is wrong, and
deciding when a classical planner is the better tool.

## What is Reinforcement Learning?

An **agent** observes a **state**, takes an **action**, and receives a **reward**; and, critically, the consequences of an action might not show up as a reward until
several steps later. Learning which action was actually responsible for a reward that
arrived steps afterward is the central problem this primer is about.

## Why should I care?

FRC alliance selection is a genuine sequential decision problem, not a single lookup:
a captain drafts a first partner, then a second, and the value of the second pick
depends entirely on what the first pick already covers (recall
`frc_resources/01_frc_intro/README.md`'s description of the draft). Whether the whole
alliance turns out well isn't knowable until after both picks are locked in; the
reward for "was pick 1 a good idea" is delayed until you see how pick 2 rounds it out.
That's the structure Reinforcement Learning is built to handle, and exactly
the structure a one-shot supervised regression (guess a score for one team, in
isolation) can't capture.

The same structure shows up in autonomous driving. A robot crossing the field makes a
sequence of moves, and the result of an early one (a wheel slip, a turn that leaves it
too close to an obstacle) might only show up several moves later, as a crash or a
missed scoring position. `03`, `05` and `06` use a small grid with a hazard on it to
cover that case: cloning a planner, comparing a learned policy with a classical one,
and fine-tuning in a simulator that isn't quite right. Whether RL belongs in the
driving stack is a harder question than whether it belongs in scouting. `05` argues
that for several layers of the stack, a tuned classical method is the better choice.

## Key Terms

A running glossary of vocabulary introduced across this primer, in the order you'll
meet it. See also the
[deep_learning_primer](../deep_learning_primer/README.md) glossary for Value Network,
Policy Network, Regression Head, and Classification Head, which this primer trains for
the first time using a real reward signal instead of a fixed label.

- **Agent**: the decision-maker; recall this term from `ai_resources/agent_primer`,
  used here in the original, narrower sense that name comes from.
- **Environment**: everything the agent's actions affect and that affects the agent
  back. In our case, the pool of remaining draftable teams and the alliance being built, or, in
  the driving notebooks, the grid the robot drives on.
- **State**: everything the agent currently knows that's relevant to deciding its next
  action.
- **Action**: a choice the agent can make from a given state.
- **Reward**: a number the environment returns after an action, indicating how good
  that action's immediate outcome was.
- **Reward Hacking**: an agent finding a way to maximize the exact reward it was given
  that isn't what its designer actually wanted. It is the default failure mode of writing a
  reward function that's only a proxy for the real goal, not a bug in the training
  loop.
- **Episode**: one complete run from a starting state to a terminal state (here, one
  full draft, or one drive from the start to the goal or a crash).
- **Return**: the total accumulated reward over an episode, from a given point
  forward.
- **Discount Factor ($\gamma$)**: a number between 0 and 1 that reduces the weight of
  rewards the further in the future they occur, when computing return.
- **Markov Decision Process (MDP)**: the formal name for the state/action/reward/
  environment structure this primer assumes.
- **Policy ($\pi$)**: a strategy/rule (possibly probabilistic) for choosing an
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
- **Epsilon-Greedy**: a simple exploration strategy: act greedily (exploit) most of
  the time, but act randomly (explore) with small probability $\epsilon$.
- **Deep Reinforcement Learning**: Reinforcement Learning where the value function
  and/or policy is represented by a neural network (a **Value Network** / **Policy
  Network**) instead of a lookup table, so it can generalize to states it has never
  exactly seen before.
- **Experience Replay**: storing past transitions in a buffer and training on randomly
  sampled batches drawn from it, instead of on the live stream of transitions in the
  order they happened. This decorrelates what a network sees update to update, since
  consecutive transitions from one episode are otherwise highly similar.
- **Target Network**: a second, temporarily-frozen copy of a Q-Network's weights, used
  to compute TD targets for a while before being periodically resynced to the live,
  training network. It is the fix for a network's bootstrapped target shifting under it on
  every single update, a separate problem from the one Experience Replay solves.
- **Off-Policy**: a learning algorithm (Q-Learning is one) whose update doesn't depend
  on which policy generated the data. It bootstraps toward the best available next
  action regardless of which action was actually taken, so it can reuse old transitions
  freely.
- **On-Policy**: a learning algorithm (Policy Gradient is one) whose update is only a
  valid estimate for the exact policy that generated the data it's trained on. Once
  the policy changes, older samples are stale and can't be reused as-is.
- **Policy Gradient**: a family of methods that adjust a Policy Network's weights
  directly, increasing the probability of actions that led to above-average reward and
  decreasing the probability of those that led to below-average reward.
- **Baseline**: a reference reward level (e.g. a running average) that policy gradient
  compares each episode's reward against, to reduce noise in the update.
- **Calibration**: whether a policy's stated confidence (its output probabilities)
  actually tracks how genuinely settled a decision is. A well-calibrated policy faced
  with two equally good options keeps meaningful probability on both, rather than
  collapsing onto whichever one got lucky early in training.
- **Entropy**: $-\sum_a \pi(a)\log\pi(a)$, a measure of how spread out a probability
  distribution is. Low entropy means a policy is decisive, which is only a good sign
  if the situation actually calls for a decisive answer.
- **Imitation Learning**: learning a policy from an expert's demonstrations
  (state, action pairs) instead of from a reward signal.
- **Behavior Cloning**: The simplest imitation learning, as it is supervised learning where the
  label is the expert's action. The training loss is the same cross-entropy `02`
  found hiding inside the policy gradient update, with the reward-shaped scaling
  factor removed.
- **Distribution Shift**: the mismatch between the states a policy was trained on (the
  expert's) and the states it actually visits when it drives itself. A small error
  puts it somewhere with no training data, so errors compound instead of averaging
  out, which is behavior cloning's defining weakness.
- **DAgger (Dataset Aggregation)**: the fix for distribution shift. Roll out the
  current policy, ask the expert to label the states the policy visited, add them to
  the dataset, and retrain, repeating in rounds.
- **Actor-Critic**: an architecture that combines both families above. A Value
  Network ("critic") judges how good the Policy Network's ("actor") chosen actions
  turned out to be, replacing a simple running-average Baseline with something that
  depends on the actual state. Named in `02`, built in `04`.
- **Return-to-Go**: the sum of rewards from a given step to the end of the episode.
  Weighting each action by its own return-to-go (not the whole episode's) is how
  policy gradient assigns credit across several steps.
- **Advantage**: how much better an action's return turned out to be than the critic
  expected from that state, $A_t = G_t - V(s_t)$. It is the Baseline idea with a
  state-dependent baseline.
- **Proximal Policy Optimization (PPO)**: a policy gradient algorithm that lets you take
  many gradient steps on one batch of experience safely. It weights each update by the
  ratio of the new policy's probability for an action to the old policy's, and
  **clips** that ratio to a small window around 1, so the policy can't move far from
  the one that collected the data. The algorithm usually named for RLHF.
- **KL Penalty**: a term added to the loss that makes a policy pay for moving away from a
  reference policy, measured by the KL divergence between their action probabilities.
  When RL fine-tunes a cloned policy, the clone is the reference. In `06` it kept
  fine-tuning from dropping to near-zero goal rates partway through training.

## What's in this Primer?

Read these in order:

1. [01 - MDPs and Value-Based Learning](01-mdps-and-value-based-learning.ipynb) -
   framing the FRC draft as an MDP, tabular Q-learning, why exploration is what makes
   Q-learning trustworthy rather than lucky, reward design pitfalls, and the jump to a
   Value Network when the state space gets too large to tabulate
2. [02 - Policy Gradients](02-policy-gradients.ipynb) - training a Policy Network
   directly from a reward signal, why the update turns out to be an ordinary
   classification loss in disguise, calibration, and how to evaluate a trained agent
   once there's no hand-worked answer left to check it against
3. [03 - Imitation Learning](03-imitation-learning.ipynb) - learning from demonstrations
   instead of reward: behavior cloning with the same network and loss as `02`, why a
   cloned policy fails in states the expert never visited, DAgger as the fix, and the
   multimodal-demonstration failure that regression heads have
4. [04 - Multi-Step Policy Gradients, Actor-Critic, and PPO](04-multi-step-policy-gradients-and-ppo.ipynb) -
   credit assignment across a 3-pick draft with a noisy, delayed reward, why plain
   policy gradient is so noisy, the baseline and the learned critic, and why PPO's
   clipping makes it safe to reuse a batch of experience
5. [05 - Where RL Fits in the Autonomy Stack](05-rl-in-the-autonomy-stack.ipynb) - which
   layers of the stack from `perception_primer/08`-`10` a learned policy belongs in, and
   which it doesn't, tested on a task where the planner's model is wrong, with a
   classical supervisor wrapped around a learned policy
6. [06 - Imitation, Then RL](06-imitation-then-rl.ipynb) - testing the claim at the end
   of `03` that policies are cloned first and fine-tuned with RL after. A clone is
   capped at its expert's level, PPO from the clone gets past it, PPO from scratch does
   not get started on this task, the KL penalty is what keeps fine-tuning from
   undoing the clone, and fine-tuning in a simulator with the wrong slip rate shows what
   a sim-to-real gap costs

## Where This Goes Next

One place the policy gradient update from `02` shows up that has nothing to do with
robots or alliance picks: the training stage that turns a raw language model into a chat
assistant. **RLHF** is this primer's framework with the language model as the policy,
the next token as the action, one whole response as the episode, and a score from a
learned reward model as the reward. `02` closes with that mapping, and
`ml_resources/genai_architecture_primer/05-post-training-instruction-tuning-and-rlhf.ipynb`
builds a working toy version, including a worked example of the Reward Hacking this
glossary defines.

Two more places this primer connects outward. Imitation learning (`03`) is the
dataset side of `ml_resources/genai_architecture_primer/08-beyond-text-diffusion-and-actions.ipynb`,
which builds diffusion and action-token policies to fix the multimodal-demonstration
failure `03` demonstrates. And `05` is the bridge to the driving stack:
`ml_resources/perception_primer/08`-`10` build the classical layers a learned policy
would sit inside or next to, and `frc_resources/09_autonomy_stack_in_frc` maps those
layers onto PathPlanner, the pose estimator, and command-based code.

Everything in this primer trains a network; nothing in it deploys one. Once a value or
policy network is trained, it becomes exactly the kind of thing
`ai_resources/agent_primer/04-tool-use-and-function-calling.md` already describes: a
real function the agent can call, with a name and a description the model uses to
decide when to reach for it. Its recommendation still isn't something that should
reach the drive team unreviewed; it goes through the same approval gate every other
scouting-agent recommendation does, per
`ai_resources/agent_primer/10-human-in-the-loop-design.md`. Wiring that connection up
for real (the tool schema, which worker owns the inference call, what the observability
trace needs that a rule-based tool didn't) is covered in
`ai_resources/agent_primer/13-integrating-a-trained-model.md`, an extension of the
existing `agent_primer` capstone rather than new content in this primer.
