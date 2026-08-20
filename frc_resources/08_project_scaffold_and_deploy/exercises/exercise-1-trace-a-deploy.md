# Exercise 1: Trace a Deploy

## Goal
Walk the full path from pressing Deploy to the Driver Station showing "Robot Code" green, using our team's real robot code repository and a real (or practice) robot — then use that same mental model to diagnose two deliberately broken deploys.

## Setup
You'll need our team's actual robot code repository (not this instructional repo — see `07_project_scaffold_and_deploy/project/README.md` for why that folder is a reference skeleton, not a buildable project) checked out on a laptop with the WPILib toolchain installed, and access to a robot (competition or practice bot) powered on and connected.

## Steps
1. Before deploying anything, open that repository's real `build.gradle` and find the three things this module's `README.md` §2 calls out: the GradleRIO plugin version, the `teamNumber`, and the `dependencies { }` block. Confirm each one against what you'd expect (matches the current season, matches our actual team number).
2. Deploy the current code to the robot (WPILib: Deploy Robot Code, or `./gradlew deploy` from a terminal). Watch the console output and narrate, out loud or in writing, which of the four steps from `README.md` §2 ("Build. Connect. Copy. Restart robot code.") you can see happening and roughly when.
3. Confirm the Driver Station's "Robot Code" indicator turns green, and note roughly how long the whole process took, start to finish.
4. **Break it on purpose, twice, and diagnose each using the decision tree in `README.md` §2:**
   - Introduce an actual compile error (a missing semicolon, an unresolved reference) somewhere harmless, save, and try to deploy. Confirm the failure happens *before* anything reaches the robot, and fix it.
   - Temporarily change `build.gradle`'s `teamNumber` to a number that isn't ours, and try to deploy. Confirm what specifically fails this time — a different failure than step 4's compile error — and revert the change.
5. In one paragraph, describe what "Robot Code" is *actually reporting* under the hood — which of the four deploy steps has to have already succeeded for that indicator to turn green, and which ones could succeed while it still stays red.

## Self-Check
- [ ] I checked and can state the real repository's current GradleRIO version, team number, and at least one real dependency
- [ ] I narrated a real deploy in terms of the four steps from `README.md` §2, not just "it worked"
- [ ] I caused and correctly diagnosed a genuine compile-error deploy failure
- [ ] I caused and correctly diagnosed a wrong-team-number deploy failure, and it produced a visibly different failure than the compile error did
- [ ] I reverted both deliberate breaks before finishing
- [ ] My closing paragraph correctly identifies which deploy steps must succeed before "Robot Code" can turn green

## Reflection
"Deploy failed" and "Robot Code" staying red are not the same signal, even though it's tempting to treat any deploy problem as one undifferentiated failure. A compile error never leaves your laptop — it's a build-tool problem, full stop. A wrong team number gets past the build but fails to find the robot at all — a connection problem. A build that succeeds, connects, and copies the JAR, but still shows red, means the new code is running and crashing (or never registering) on the robot itself — an entirely different place to go looking, usually in the console/riolog output rather than back in your source diff. Treating these as one generic "deploy is broken" problem wastes exactly the kind of short pit-debugging window `06_hardware_debugging` §3 warns about; knowing which of the three you're looking at cuts that search down immediately.
