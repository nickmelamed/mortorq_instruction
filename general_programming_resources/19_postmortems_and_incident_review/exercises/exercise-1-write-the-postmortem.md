# Exercise 1: Write the Postmortem

## Goal
Turn a blame-y, unverified incident recap into a real blameless postmortem by testing its stated theory against the facts instead of trusting it.

## Scenario
`examples/vague_incident_recap.md` blames the Match 14 brownout on a low battery, hedges on whether the climb code itself is buggy, and never actually checks either guess against the raw notes sitting in the same file. Treat those raw notes the way you'd treat any other unverified hypothesis in `06_debugging_methodology`: something to test, not something to assume.

## Steps
1. **Build the timeline first, before touching the recap's conclusion.** Pull every timestamped fact from the "Raw notes" section into order: battery swap, match start, climb start, brownout warning, freeze start and end, match end.
   
2. **Test the recap's stated hypothesis.** The recap blames a low battery. Check that against the actual voltage reading and the time it was measured. Does the battery explanation survive contact with the facts, or does it fall apart the same way a hypothesis falls apart in step 4 of `06`'s five-step loop?
   
3. **Find the real root cause.** Read the pit scout's note from match 11 and the current-limit fact together. What single mechanical problem, left unaddressed for three matches, explains a stall and a current spike big enough to brown out the robot?
   
4. **Name at least two contributing factors, separate from the root cause itself.** The bent bracket is what physically failed, but at least two process gaps let it stay unaddressed and unmitigated. Name both.
   
5. **Write one concrete follow-up action per contributing factor**, each with a specific owner and a deadline (e.g., "before next event," not "soon").
   
6. **Rewrite the whole recap as a real postmortem**, following `concept.md`'s four-part anatomy, with every sentence that names a person as the cause removed.

## Self-Check
- [ ] My timeline uses the actual timestamps from the raw notes, in order
- [ ] I can state, in one sentence, why the battery explanation doesn't hold up against the voltage reading and its timing
- [ ] My root cause names the bent bracket and the resulting stall/current spike, not the battery
- [ ] I named at least two distinct contributing factors (not the same fact restated twice)
- [ ] Every follow-up action has a named owner and a deadline
- [ ] No sentence in my rewritten postmortem blames a specific person

## Reflection
Notice that the recap's own facts were sitting right there the whole time. Nobody needed new information to get this right, they needed to actually check the theory against what they already had. The bracket, the missing current limit, and the missing re-inspection step were all present three matches before this one actually cost a climb.
