# 13 Integrating a Trained Model

## Beyond the Core Twelve

`12-capstone-build.md` assembled the scouting agent's seven layers into one finished system, using tools you could build by hand or hand-simulate. This module is an optional extension past that point, not a required eighth layer: it's what actually changes once one of this team's own trained models - the value or policy network from `ml_resources/rl_primer` - exists for real and needs to become something the agent can call, instead of a result sitting in a notebook.

## From a Notebook Result to a Tool

Recall `04-tool-use-and-function-calling.md`'s tool schema: name, description, typed parameters. A trained model is described to the agent exactly the same way - it's still just a real piece of code the agent is allowed to call, the model itself never sees the network's weights any more than it saw `get_team_match_history`'s implementation.

```json
{
  "name": "get_alliance_pick_value",
  "description": "Scores a candidate alliance-pick team using a value network trained on this season's scouting stats (climb rate, auto score, rank). Returns a single number - higher means a stronger pick. Does not account for anything outside the stat fields it was trained on, e.g. a team's very recent mechanical failure that hasn't shown up in scouting data yet.",
  "parameters": {
    "team_number": {
      "type": "integer",
      "description": "The FRC team number to score, e.g. 4930"
    },
    "event_code": {
      "type": "string",
      "description": "The competition event code whose scouting stats to score against"
    }
  }
}
```

Everything `04` said about a badly-described tool being ignored, misused, or silently bypassed applies just as much here - a model doesn't get a pass on needing a clear name and description just because it's the "AI" tool in the list. If anything, a vague description is worse for a model-backed tool: the agent has no other way to sanity-check a number it can't independently verify, the way it might notice an obviously malformed match history.

## Where the Model Lives: A Dedicated Worker

Recall `07-multi-agent-systems.md`'s supervisor/worker split. A trained model's inference is a good candidate for its own narrow worker - a **strategy-inference worker**: given one team's feature vector, run the forward pass, return the value or action-probabilities, nothing else. It doesn't need the conversation history, doesn't need to know the overall goal is "recommend 3 picks" - it just needs the input features, exactly the same context-isolation argument `07` already made for the data-fetching worker, applied to a different kind of narrow job.

```text
Supervisor: I have data-fetching results for teams 1114, 2056, and 254.
Supervisor -> Strategy-Inference Worker: "Score team 1114: climb_rate=0.90, auto_score=4.2, rank=3"
Worker: (loads the trained value network, runs one forward pass, nothing else)
Worker -> Supervisor: "Value: 14.2"
... (repeats for each candidate team) ...
Supervisor: Now ranking all three scored candidates against our own weaknesses.
```

## What the Model's Output Is - and Isn't

Recall from `ml_resources/deep_learning_primer` and `ml_resources/rl_primer`: a value network outputs one number (a Regression Head); a policy network outputs a probability distribution over actions (a Classification Head plus softmax). Neither is a hallucination-proof oracle - a value network trained on last season's data can be confidently wrong about a team whose robot changed significantly over the offseason, the same "confidently wrong" warning `ai_primer/00-ai-for-programming.md` gave about any model, and the same failure mode `08-guardrails-failure-modes-and-eval.md` covered for hallucinated tool results, just coming from a network's forward pass instead of a language model's text generation.

Recall too `rl_primer/02-policy-gradients.ipynb`'s calibration point: a well-calibrated policy network stays genuinely uncertain (probabilities spread across several options) when the input really is ambiguous, rather than being falsely confident. Treat a low-confidence policy output as a signal worth surfacing to a human reviewer, not something to silently resolve by taking the argmax anyway and presenting it as a confident recommendation.

## The Approval Gate Doesn't Change

Recall `10-human-in-the-loop-design.md`'s own line: *"This is the same logic FRC teams already use for autonomous mode: the robot executes a pre-set sequence without live driver input specifically because that sequence was tested and approved in advance to be safe to run unsupervised."* A trained model's recommendation doesn't get an exception from this - if anything it deserves more scrutiny than a rule-based recommendation, because a value network's reasoning isn't inspectable the way a hand-written scoring formula is. You can read every line of a formula that computes `climb_rate * 5 + auto_score`; you cannot read a trained network's weights and explain in one sentence why it preferred one team over another.

This is exactly why the observability trace from `09-observability.md` needs one more field for a model-backed tool than it needed for any tool in `04` through `10`: which model version made the call, not just what it returned. A rule-based tool's logic doesn't change under you; a retrained model does, silently, every time someone reruns training with new data. A trace that can't answer "which version of the value network produced this number" is exactly as undiagnosable as `09`'s "only the final two lines were logged" failure - a bad recommendation with no way to reproduce or explain it after the fact.

## Build It

Take a value or policy network you actually trained in `ml_resources/rl_primer` (a hand-simulated version, the way `12`'s capstone allows for its other layers, is fine too).

1. Write a real tool schema for it, following `04`'s format exactly - name, description (including what it does *not* account for), typed parameters.
2. Design the worker boundary: what's the narrowest input this worker actually needs, and what does it hand back to the supervisor? Justify why it doesn't need anything more.
3. Write the approval-gate text a human would see before this model's recommendation reaches the drive team, reusing `10`'s exact format: what it's about to do, what data backs it up, and an explicit approve/edit/cancel choice.
4. Add one field to your observability log from `09` that wasn't needed for any of the rule-based tools in `04` through `10`, and name specifically what failure it would let you diagnose that the existing fields couldn't.

Score yourself the same honest way `12` asked you to: can you say, specifically, what this model-backed tool still gets wrong or doesn't handle - not just that it works, but where its confidence should and shouldn't be trusted.
