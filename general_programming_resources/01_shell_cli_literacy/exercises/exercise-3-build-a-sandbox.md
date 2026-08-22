# Exercise 3: Build a Sandbox

## Goal
Practice `mkdir`, `touch`, `cp`, `mv`, `rm`, and `chmod` hands-on, and learn to read a permission string instead of just knowing `chmod +x` exists.

## Scenario
Everything in this exercise happens inside a scratch folder you create and delete yourself, so there's nothing here to break. This is the kind of low-stakes place to build the muscle memory for commands that are genuinely dangerous once real work depends on them.

## Steps
1. From inside `01_shell_cli_literacy/`, create a new directory called `sandbox` with `mkdir`, then `cd` into it.
   
2. Use `touch` to create an empty file called `notes.txt`. Confirm it's empty with `ls -la`.
   
3. Copy `../examples/sample_project/src/Arm.java` into your `sandbox/` with `cp`.
   
4. Rename your copy to `ArmBackup.java` using `mv` — still inside `sandbox/`, and without touching the original file.
   
5. Run `ls -la` and read the permission string on `ArmBackup.java` (something like `-rw-r--r--`). Is the execute (`x`) bit set for you, the owner?
   
6. Create a tiny script by hand: `echo '#!/bin/bash' > try.sh` followed by `echo 'echo hello' >> try.sh`. Try to run it with `./try.sh`, it should fail with a permission error. Then run `chmod +x try.sh` and try again.
   
7. Once you're done, move back up one directory and delete the entire sandbox with a single `rm -rf sandbox` command. Confirm with `ls` that it's gone.

## Self-Check
- [ ] `sandbox/notes.txt` was created and confirmed empty with `ls -la` before you moved on
- [ ] `ArmBackup.java` exists as a copy inside `sandbox/`, and the original `Arm.java` still exists, untouched, in `examples/sample_project/src/`
- [ ] I can state, in my own words, what the `x` bit in a permission string like `-rwxr-xr-x` actually controls
- [ ] `try.sh` failed to run before `chmod +x`, and succeeded after
- [ ] `sandbox/` no longer exists after the final `rm -rf`, confirmed with `ls`

## Reflection
A script with completely correct code inside it still won't run until its execute bit is set, because permissions and correctness are two entirely separate questions the shell checks independently. And step 7's `rm -rf` is the exact command `concept.md`'s File Operations warning is about. The only reason it was safe to run without hesitation here is that you built this folder yourself, five steps ago, and knew exactly what was in it. That's the actual habit worth keeping: not fear of `rm -rf`, but never running it against something you didn't just confirm with `ls`.
