# Exercise 2: Shotgun Surgery and Long Parameter Lists

## Goal
Fix a real inconsistency caused by each of the two code smells `exercise-1` doesn't cover. Practice separating refactoring from behavior change. 

## Part A — Shotgun Surgery

`examples/shotgun_surgery/` has one idea — the current event's name — copied into four separate files: `header.py`, `pdf_export.py`, `email_summary.py`, `settings_page.py`. The event changed from "Week 3 Regional" to "Week 4 Regional" recently, and one of the four files never got updated.

1. Run `python3 print_all.py` and find the exact file whose output disagrees with the other three.
   
2. **Fix the immediate bug, alone.** Update just that one file so all four outputs agree, then rerun `print_all.py` to confirm. This is a bug fix, not a refactor. If you're working in a real repo, this is the moment to commit, by itself, with a message like `fix: correct stale event name in email_summary.py`.
   
3. **Now refactor, separately.** Create `event_config.py` with one constant, `CURRENT_EVENT`. Update all four files to import and use it instead of keeping their own copy of the string.
   
4. Rerun `print_all.py` again and confirm the output is identical, character for character, to step 2's already-fixed output.
   
5. If you're working in a real repo, this is a second, separate commit — `refactor: consolidate event name into event_config.py` — deliberately kept apart from step 2's bug fix.
   
6. Imagine the event changes again next week. State, in one sentence, exactly what you'd need to edit now, versus what you'd have needed to edit before this refactor.

## Part B — Long Parameter Lists

`examples/long_parameter_list/scouting_entry.py` has one function, `record_match_entry`, taking seven positional arguments. `log_entries.py` calls it twice.

1. Run `python3 log_entries.py` and read both printed lines. One team's printed numbers directly contradict their own notes — which one, and how?
   
2. Look at the exact call responsible: `record_match_entry(254, 12, 30, 6, 15, "Strong teleop, no auto", "Priya")`. Without cross-checking against the function definition, can you tell just by reading this line which two arguments got swapped? If you can't tell at a glance, that's the actual problem this exercise is about.
   
3. Refactor `record_match_entry` in `scouting_entry.py` so `auto_points`, `teleop_points`, and `endgame_points` are bundled into one object instead of three separate positional arguments — a small `@dataclass` (call it `MatchScores`) with those three fields, constructed with keyword arguments.
   
4. Update both calls in `log_entries.py` to build a `MatchScores(...)` with named fields instead of passing three bare numbers, fixing team 254's actual swapped values while you're there.
   
5. Rerun `log_entries.py` and confirm team 254's printed numbers now agree with their notes.

## Self-Check
- [ ] I identified the exact out-of-sync file in Part A before changing anything
- [ ] Part A's bug fix and refactor are two logically separate steps (and, if working in a real repo, two separate commits) — not one combined change
- [ ] `print_all.py`'s output is identical before and after the Part A refactor
- [ ] I can state, in one sentence, what changes about a future event-name update after the Part A refactor
- [ ] I identified which team's Part B numbers contradicted their notes, and why the swap was easy to miss at a glance
- [ ] `MatchScores` is constructed with keyword arguments everywhere it's used, and team 254's values are now correct

## Reflection
Neither bug was caused by anyone being careless in an unusual way. Four files each holding their own copy of the same string will drift eventually, not because someone forgot, but because "update it everywhere" doesn't scale as an editing strategy. And two adjacent same-typed arguments will get swapped eventually, not because a scout wasn't paying attention, but because `30, 6` and `6, 30` are visually indistinguishable at a glance when nothing labels which is which. Structure that relies on humans getting unenforced conventions right every time is bound to fail. 
