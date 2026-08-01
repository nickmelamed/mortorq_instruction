# Exercise 1: Add a Subsystem, Then Prove the Profile Switch Works

## Goal
Extend `Constants.java` with a new subsystem's values following its existing pattern, then prove — with printed evidence, not just by reading the code — exactly which values actually change when you flip `ACTIVE_PROFILE`, and which don't.

## Setup
Work in `09_configuration_constants_management/java/Constants.java` and `ConfigPatternDemo.java`. Compile/run with:
```text
$ javac ConfigPatternDemo.java Constants.java
$ java ConfigPatternDemo
```

## Steps
1. Add a new nested class, `ClimberConstants`, following the exact shape of `IntakeConstants` (private constructor, `public static final` fields): give it a `MOTOR_CAN_ID` and a `CLIMB_POWER`. These don't need to depend on `ACTIVE_PROFILE` — pick any reasonable constant values.
2. In `ConfigPatternDemo.java`, add a print statement for your new `ClimberConstants` values, in the same style as the existing sections.
3. Before touching `ACTIVE_PROFILE`, write down a prediction: if you flip it from `COMP_BOT` to `PRACTICE_BOT` and recompile, which specific printed values will change, and which will stay exactly the same? Use only what you can see in `Constants.java` to answer — don't guess.
4. Flip `Constants.ACTIVE_PROFILE` to `PRACTICE_BOT`, recompile both files, and rerun. Compare the full printed output, line by line, against your prediction from step 3 and against a run with `COMP_BOT`.
5. Your `ClimberConstants` values from step 1 — did they change between the two runs? Should they have, given how you defined them? If a real team later wanted the climber's power to also differ between practice and comp bots, what specifically would you need to change in `ClimberConstants` to make that possible (look at how `WHEEL_DIAMETER_INCHES` does it)?

## Self-Check
- [ ] `ClimberConstants` compiles and follows the existing nested-class pattern (private constructor, grouped fields)
- [ ] My prediction from step 3 correctly identified `WHEEL_DIAMETER_INCHES` and `KP` as profile-dependent and the other printed values as not
- [ ] I confirmed my prediction against real output from both `COMP_BOT` and `PRACTICE_BOT` runs
- [ ] I correctly explained why my new `ClimberConstants` values didn't change between profiles, and what a profile-dependent version would need (a conditional expression referencing `ACTIVE_PROFILE`, the same shape `WHEEL_DIAMETER_INCHES` uses)

## Reflection
The whole value of this pattern shows up in step 4: switching robots was one enum value and a recompile, not a search-and-replace across every file that used a wheel diameter or a PID gain. Step 5 is the part that's easy to miss on a first read of `Constants.java` — a value only becomes profile-aware if you *deliberately* write it as a conditional against `ACTIVE_PROFILE`, the way `WHEEL_DIAMETER_INCHES` and `KP` do. Adding a new constant that should differ between robots and forgetting that step is exactly how a team ends up debugging "why does the practice bot's climber behave like the comp bot's" mid-season — the pattern only protects you from that class of bug where you actually use it, not automatically everywhere.
