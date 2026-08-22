# Exercise 2: Decouple and Encapsulate

## Goal
Refactor a tightly-coupled, leaky-interface `Drivetrain` into one with a clean public interface. You will then prove, not just claim, that the fix actually protects its internal state.

## Scenario
`examples/coupled_drivetrain/` has the same routine in Java and Python: an `adjustHeading`/`adjust_heading` function that reaches directly into `Drivetrain`'s public fields to scale down the left motor power and record it, three times in a row. `Drivetrain` itself has no methods at all. It just public fields, including a mutable list handed out with no protection whatsoever.

## Steps
1. Pick Java, Python, or both. Run the version(s) you're comfortable in and record the output exactly as printed.
   
2. Identify every place `adjustHeading` reaches directly into `Drivetrain`'s internals instead of going through a method `Drivetrain` provides. There are two separate problems here, not one: tight coupling (reading and writing a field directly) and a leaky interface (mutating a list that was handed out by direct reference).
   
3. **Prove the leak is real before you fix it.** From outside `Drivetrain` — a couple of extra lines right after building it — append a fake value directly to its power-history field/list. Confirm the real internal state is now corrupted.
   
4. Refactor `Drivetrain` to have a real interface: `setLeftPower`/`getLeftPower` (or `set_left_power`/`get_left_power`), and a method that returns the power history as a **copy**, not the live list. Update `adjustHeading` to use only these methods.
   
5. Re-run and confirm the output is identical to step 1.
   
6. **Prove the fix worked.** Repeat step 3's corruption attempt, but this time against whatever your new history-returning method gives you. Confirm the real internal state is now unaffected, even though the thing you tampered with looks identical to before.

## Self-Check
- [ ] `adjustHeading`/`adjust_heading` no longer touches any of `Drivetrain`'s fields directly. This means every interaction goes through a method
- [ ] The method that returns power history returns a copy, confirmed by the step 6 tampering test actually failing to corrupt anything
- [ ] Output before and after refactoring is identical, run to run
- [ ] I can point at the exact line that made step 3's corruption possible, and the exact line that closed it in step 6

## Reflection
Steps 3 and 6 are the actual point of this exercise. It's easy to read "returning a copy keeps the interface safe" in `concept.md` and nod along without it meaning anything concrete. Actually corrupting real internal state with two lines of outside code, then watching the identical attempt fail once the interface is fixed, is what turns encapsulation from a claim into something you've verified yourself. Nothing about *what* `adjustHeading` computes changed in this refactor, only what it's allowed to touch directly.
