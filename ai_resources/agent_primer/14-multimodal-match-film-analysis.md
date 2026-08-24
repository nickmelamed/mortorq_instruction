# 14 Multimodal Match Film Analysis

## Beyond the Core Twelve, Again

`13-integrating-a-trained-model.md` was one optional extension past `12-capstone-build.md`'s seven layers: wiring `ml_resources/rl_primer`'s trained value/policy network in as a tool, once that model existed for real. This module is a second, independent extension of the same shape, built on a different piece: `ml_resources/genai_architecture_primer/06-multimodal-and-shared-embedding-spaces.ipynb`'s own README made a promise early in that primer - *"if this team's scouting agent ever needs to fuse multiple kinds of scouting data (match text, stats, video) into one model, a Transformer-style encoder is the standard tool for exactly that."* `06` cashed that promise in for a single hand-designed toy image. This module cashes it in for real: turning a vision-capable model into a tool the scouting agent can call on actual match film, the same way `13` did for a trained network.

You don't need `13` to do this module, or vice versa - they're two separate follow-ons from `12`, not a sequence.

## From a Toy Image to a Real Tool

Recall `04-tool-use-and-function-calling.md`'s tool schema: name, description, typed parameters. A vision-capable model is described to the agent exactly the same way `13` described a value network - a real piece of code the agent is allowed to call, whose weights it never sees any more than it saw `get_team_match_history`'s implementation.

The gap this closes: every tool the scouting agent has had access to through `13` only reasons over what a human already typed into a structured field - `climb_rate`, `auto_score`, a scouting note. A human scouter can't watch every match live, and even one they did watch can't type everything they saw into a handful of columns. TBA's own match records carry a `videos` field (a YouTube key, per match) that nothing built so far has touched. A tool wrapping a vision-capable model over sampled frames from that film is what lets the agent reason over what actually happened on the field, not just what a scouter had time to log about it.

```json
{
  "name": "describe_match_film",
  "description": "Given still frames sampled from one FRC match's video, describes what a specific team's robot was doing in plain text (e.g. cycle rhythm, defense positioning, a visible mechanism failure). Frames are sampled at a fixed interval, not full video - fast actions between samples, or anything off-camera, may be missed entirely. Returns a description, not a verified fact - treat it as a lead for a human to confirm against the actual clip, never as equivalent in reliability to a manually-entered scouting field.",
  "parameters": {
    "frame_urls": {
      "type": "array",
      "items": { "type": "string" },
      "description": "URLs of the sampled still frames to analyze, in chronological order"
    },
    "team_number": {
      "type": "integer",
      "description": "The FRC team number whose robot the description should focus on, e.g. 4930"
    },
    "focus_question": {
      "type": "string",
      "description": "A specific question to focus the description on, e.g. 'did this robot play defense in the last 30 seconds' - not an open-ended 'describe everything'"
    }
  }
}
```

Everything `04` said about a vague description getting a tool ignored or misused applies here without exception. `focus_question` earns its own parameter for that reason: an agent that hands over frames with no specific question invites the same "describe everything, usefully answer nothing" failure a bad prompt produces in any other context.

## Real-World Wiring: A Vision-Capable Model, Not a Homemade One

`13`'s tool wrapped a network this team trained itself in `rl_primer`. This one doesn't - building a Vision Transformer from scratch that's actually good at describing FRC match footage is far past what `06`'s toy 8x8-pixel, 4-patch example was ever meant to teach; `06`'s own README says as much about itself ("toy-scale... does not train a real language model"). In practice, `describe_match_film` calls an existing vision-capable model (the same category already used for chat and coding elsewhere in this curriculum, via its vision-input API) the same way `ai_primer` never asked you to train a chatbot before using one.

That has a real cost `06` didn't: recall `ai_primer/01-context-is-key.md`'s token budget. A sampled frame doesn't arrive as free context the way a short text tool result does - each image consumes a real, non-trivial number of tokens on the way in, and `frame_urls` sent as an unbounded list is an unbounded token cost, not a hypothetical one.

## Where the Model Lives: A Dedicated Worker

Recall `07-multi-agent-systems.md`'s supervisor/worker split, and the strategy-inference worker `13` added to it for a value network's forward pass. A **film-analysis worker** is a third narrow job of the same shape: given one team's sampled frames and one focused question, call the vision-capable model and return a short, distilled description - nothing else. It doesn't need the overall goal ("recommend 2 alliance picks"), doesn't need any other team's frames, and doesn't need to have seen the conversation that decided this team was worth checking on film in the first place.

```text
Supervisor: Scouting notes on team 2056 mention "maybe plays defense" but no scouter
            logged it as a field. Checking match film to confirm before I weigh it.
Supervisor -> Film-Analysis Worker: "Frames from team 2056's Q47, focus: did this
                                      robot play defense in the last 30 seconds?"
Worker: (loads the sampled frames, runs one vision-model call, nothing else)
Worker -> Supervisor: "Robot 2056 is visibly positioned between the opposing scorer
                        and the goal for the final ~20 seconds of the clip; consistent
                        with defense, not confirmed as intentional strategy."
Supervisor: Weighing that alongside 2056's structured stats for the final ranking.
```

## What the Model's Output Is, and Isn't

`13` distinguished a value network's single number from a policy network's probability distribution - both are numbers, checkable against a held-out label the way `rl_primer/02-policy-gradients.ipynb` did. `describe_match_film`'s output isn't a number at all; it's generated text, exactly as unverifiable-by-construction as any other LLM output covered since `ai_primer/00-ai-for-programming.md`, except now grounded in pixels it can also just misread. `06` demonstrated cross-modal attention on a background that was uniform gray except for one deliberately bright patch - real match film has none of that guaranteed contrast. Two robots in the same alliance color, a partial occlusion behind a field element, or a motion-blurred cycle can all produce a fluent, confident description of the wrong robot doing the wrong thing. That's a distinct failure mode from anything `04` through `13` had to guard against: a bad stats-based tool call fails on a bad query or missing data; this tool can succeed on every technical measure - valid frames, valid team number, a real response - and still be describing the wrong robot in the frame.

## The Approval Gate Doesn't Change

Recall `10-human-in-the-loop-design.md`'s own line: *"This is the same logic we already use for autonomous mode: the robot executes a pre-set sequence without live driver input specifically because that sequence was tested and approved in advance to be safe to run unsupervised."* `13` already established that a trained model's recommendation gets no exception from this. A film description deserves the same scrutiny for a sharper reason: a value network's number can at least be checked for calibration against held-out matches, per `rl_primer/02`. A vision-model description of one specific clip has no equivalent held-out check - the only way to verify it is to actually watch the clip it claims to describe, which is exactly why the approval step for this tool's output should surface the source frames alongside the claim, not just the claim on its own.

## One More Observability Field, a Different One Than 13's

`13` added model version to the observability trace from `09-observability.md`, because a retrained network changes silently and a trace needs to say which version produced a given number. `describe_match_film` needs a field `13` didn't: exactly which frames (URLs or timestamps, in order) were sampled and sent for a given description. A value network's input is a fixed set of stats that don't change between two calls; this tool's input depends on an upstream sampling step that could hand it a different set of frames on a rerun, and a description is only reproducible - or checkable against the actual clip - if the trace records precisely what the model was looking at when it produced that description. Without that field, a wrong description is exactly `09`'s "only the final two lines were logged" failure again: undiagnosable, because there's no way to know afterward what the model actually saw.

## Build It

Take a vision-capable model you have real access to (any chat interface that accepts image uploads is enough; a hand-simulated version, the way `12` and `13` both allow, works too if you don't have real frames to work with).

1. Write a real tool schema for it, following `04`'s format exactly: name, description (including what it does *not* account for), typed parameters. You can extend the one above or write your own. \\
2. Design the worker boundary: what's the narrowest set of frames and question this worker actually needs, and what does it hand back to the supervisor? Justify why it doesn't need anything more. \\
3. Write the approval-gate text a human would see before this tool's description reaches the drive team or factors into a pick-list ranking, reusing `10`'s exact format: what it's about to do, what evidence backs it up (including the source frames, not just the claim), and an explicit approve/edit/cancel choice. \\
4. Add the frame-provenance field described above to your observability log from `09`, and name specifically what failure it would let you diagnose that `13`'s model-version field wouldn't. \\

Score yourself the same honest way `12` and `13` both asked: can you say, specifically, what this tool still gets wrong or doesn't handle. A description that reads fluently is not the same thing as a description that's correct.

## Resources

- Rohrbach, A. et al. (2018). "Object Hallucination in Image Captioning" - the original benchmark paper measuring how often an image-grounded model describes an object that isn't actually in the image, directly behind this module's warning about a confident but wrong film description (paper)
- [Vision Language Models Explained](https://huggingface.co/blog/vlms) - Hugging Face's practical overview of how real vision-capable models work and where they commonly fail, the applied counterpart to `06`'s from-scratch mechanism (blog)
