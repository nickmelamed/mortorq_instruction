# Exercise 6: Capstone - Do It Yourself

`07-sample-prompt.md` walked you through all 8 turns with the prompts already written out. This time, you write every prompt yourself, on a problem the primer never covered, so there's nothing to copy.

## Goal
Run the full 8-turn structure end to end on a new problem, applying the techniques from every prior file.

## Scenario: Autonomous Waypoint List Validation

Your robot's autonomous routine follows a list of waypoints. Each waypoint is a dict with `x_in`, `y_in`, `heading_deg`, and `target_time_s`.

Rules to give the model in Turn 1 (don't mention the exception below yet):
- `x_in` must be between 0 and 651 (field length, inches)
- `y_in` must be between 0 and 315 (field width, inches)
- `heading_deg` must be between -180 and 180
- `target_time_s` must strictly increase from one waypoint to the next
- An invalid waypoint should raise a `ValueError` identifying which waypoint failed and why

**Save this for Turn 3, don't reveal it up front:** the very first waypoint's `heading_deg` must be exactly `0` (robot always starts facing forward).

## Steps
Write your own prompt for each turn. Use `07-sample-prompt.md` as a reference for what each turn is trying to accomplish, not for wording to copy.

1. **Good Context + Constraints:** role, explicit context, constraints, decomposition (rules restated + step-by-step approach, no code yet)
2. **React to the AI's response:** correct anything it got wrong before moving on
3. **Consistency Lock + Feedback:** now reveal the first-waypoint heading exception as a clarification. Don't let it touch the code yet.
4. **Approach Refinement:** ask for the approach update to reflect the exception
5. **Controlled Implementation:** implementation with real constraints (stdlib only, a line limit, clear names)
6. **Verification via Rule Restatement:** re-list every rule, including the exception, and confirm the code enforces each one
7. **Edge Cases:** test at least: a clean pass, a heading-exception violation, non-increasing `target_time_s`, an empty list, and a boundary value
8. **Self Review:** ask for one bug/limitation, one production improvement, one beginner takeaway

Once you have a final function, paste it into your own environment and run it against your Turn 7 edge cases yourself.

## Self-Check
- [ ] Completed all 8 turns
- [ ] Introduced the heading exception only at Turn 3, not Turn 1
- [ ] Ran the final function myself against the edge cases and confirmed the real output

## Reflection
Fill in your own version of the recap table from `07-sample-prompt.md`: which technique(s) did you use on each turn?
