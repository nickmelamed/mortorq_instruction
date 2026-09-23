# 09 - Configuration and Constants Management

## Magic Numbers are Problematic

A **magic number** is a literal value dropped directly into code with no name explaining what it means or where it came from: `motor.setPower(0.65)`, `if (distance < 4.5)`. Read in isolation, months later, `0.65` and `4.5` say nothing about what they represent, why that specific value was chosen, or what else in the codebase depends on it staying consistent. The risk compounds the moment the same value gets copied into more than one place (either by hand, or by an AI coding assistant asked to "just change the intake power") because now one spot can get updated while the others quietly don't, and nothing about the code makes that drift visible.

## Centralized Constants Pattern

The fix is a **constants pattern**: pull every one of these values out into one well-organized, named location, and have the rest of your code reference that name instead of retyping the literal. `Constants.DRIVETRAIN_WHEEL_DIAMETER_INCHES` says what it is at the point of use; `0.65` doesn't. When a value needs to change, it changes in exactly one place, no matter how many places in the codebase reference it.

A well-organized constants file groups values by the subsystem or concern they belong to, rather than dumping everything into one flat, undifferentiated list; `java/Constants.java` groups drivetrain values separately from intake values separately from PID gains, so you can find (and safely change) the one you're looking for without wading through everything else.

## Why this matters for Practice vs. Competition Bots

Most FRC teams (including us sometimes) run two physical robots off the same codebase: a practice bot for iterating and drilling, and the competition bot that actually goes to events. These two robots frequently need different tuning values, like a slightly different wheel diameter (manufacturing tolerance, wear over a season), PID gains tuned for one chassis's specific quirks. Without a config pattern, switching which robot you're deploying to means hand-editing values throughout the codebase before every practice session and every match. As you can imagine, this is where things go wrong. 

With a centralized pattern, this becomes a single flag: `java/ConfigPatternDemo.java` shows the shape of this code that reads values from `Constants.java` rather than hardcoding them, plus a `ROBOT_MODE` style flag showing how you'd extend the same pattern to select between a `PRACTICE_BOT` profile and a `COMP_BOT` profile, without touching the rest of the codebase at all.

That flag itself is a decision worth noticing, not just a detail. `Constants.java`'s `ACTIVE_PROFILE` here is flipped by hand and baked in at compile time. Its simple, but it means a human has to remember to flip it (and recompile) before every deploy, with nothing stopping `COMP_BOT`-flagged code from getting deployed to the practice bot by mistake. The alternative is detecting the profile automatically at boot instead of trusting a human to set it correctly (like a jumper wire or a DIO pin wired high on one robot and low on the other) read once at startup so the exact same compiled code just works correctly on whichever robot it happens to be running on. Manual-and-simple versus automatic-and-foolproof is a real tradeoff, not a settled question; which one is worth the extra wiring/setup effort depends on how often your team actually gets bitten by a wrong-profile deploy.

## Putting it together

`java/Constants.java` is a WPILib-style constants file, organized by subsystem. `java/ConfigPatternDemo.java` shows code consuming those constants instead of hardcoding values, plus a brief demonstration of switching between two named profiles to support a practice bot and a competition bot side by side. This isn't just a standalone demo pattern, either — `frc_resources/08_project_scaffold_and_deploy` reuses `IntakeConstants.INTAKE_POWER` from this exact file directly, so you can see the same centralized-constants pattern land in a real project layout, not just here.

## Resources

- [WPILib: Structuring a Command-Based Robot Project](https://docs.wpilib.org/en/stable/docs/software/commandbased/structuring-command-based-project.html) - the official docs describing the real `Constants.java` convention this unit's file follows, subsystem-grouped inner classes and all.
- [The Twelve-Factor App: Config](https://12factor.net/config) - a widely-referenced methodology essay on keeping configuration separate from code, from outside the FRC world entirely.
- [Wikipedia: Magic number (programming)](https://en.wikipedia.org/wiki/Magic_number_(programming)) - a fuller catalog of the anti-pattern this unit opens with.
