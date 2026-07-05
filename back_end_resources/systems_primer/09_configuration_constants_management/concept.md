# 09 - Configuration and Constants Management

## The problem with magic numbers

A **magic number** is a literal value dropped directly into code with no name explaining what it means or where it came from: `motor.setPower(0.65)`, `if (distance < 4.5)`. Read in isolation, months later, `0.65` and `4.5` say nothing about what they represent, why that specific value was chosen, or what else in the codebase depends on it staying consistent. Worse, the same conceptual value (say, your drivetrain's wheel diameter) tends to get typed as a literal in more than one place, and nothing stops those copies from silently drifting apart when only one of them gets updated.

## The centralized constants pattern

The fix is a **constants pattern**: pull every one of these values out into one well-organized, named location, and have the rest of your code reference that name instead of retyping the literal. `Constants.DRIVETRAIN_WHEEL_DIAMETER_INCHES` says what it is at the point of use; `0.65` doesn't. When a value needs to change, it changes in exactly one place, and every piece of code that reads that constant picks up the new value automatically and consistently.

A well-organized constants file groups values by the subsystem or concern they belong to, rather than dumping everything into one flat, undifferentiated list — `java/Constants.java` groups drivetrain values separately from intake values separately from PID gains, so you can find (and safely change) the one you're looking for without wading through everything else.

## Why this matters especially in FRC: practice bot vs. competition bot

Many teams build two robots: a practice bot (sometimes an earlier prototype, sometimes intentionally slightly different) and the competition bot that actually competes. These two robots frequently need different tuning values — a slightly different wheel diameter, a different gear ratio, PID gains tuned for one chassis's specific quirks. Without a config pattern, switching which robot you're deploying to means hand-editing values throughout the codebase before every practice session and every match — slow, error-prone, and exactly the kind of thing that goes wrong under time pressure in the pits.

With a centralized pattern, this becomes a single flag: `java/ConfigPatternDemo.java` shows the shape of this — code that reads values from `Constants.java` rather than hardcoding them, plus a `ROBOT_MODE` style flag showing how you'd extend the same pattern to select between a `PRACTICE_BOT` profile and a `COMP_BOT` profile, without touching the rest of the codebase at all.

## Putting it together

`java/Constants.java` is a WPILib-style constants file, organized by subsystem. `java/ConfigPatternDemo.java` shows code consuming those constants instead of hardcoding values, plus a brief demonstration of switching between two named profiles to support a practice bot and a competition bot side by side.
