# Exercise 3: Get the Key Out of the Code

## Goal
Move a hardcoded credential out of tracked source code and into an environment variable, and set up the project so it can't accidentally go back in.

## Scenario
`examples/scouting_tool/tba_client.py` has a real-shaped API key sitting directly in the source file: `API_KEY = "tba_live_9f8a2c3d4e5f"`. If this project were pushed to a real repository right now, that value would be committed and visible to anyone with access, forever, in the commit history.

## Steps
1. Identify the hardcoded secret in `tba_client.py`.
   
2. Rewrite the file so `API_KEY` is read from an environment variable instead — `os.environ["TBA_API_KEY"]` — and confirm it still works by setting the variable locally with `export TBA_API_KEY=tba_live_9f8a2c3d4e5f` 
   
3. Read (`01_shell_cli_literacy`) before running the script.
   
4. Create a `.env.example` file next to it, listing the variable name with a placeholder value only (`TBA_API_KEY=your-key-here`).
   
5. Confirm there's a `.gitignore` entry that would exclude a real `.env` file from ever being committed (add one if this project doesn't already have one).
   
6. In one sentence, explain why deleting the hardcoded line in a later commit would *not* undo the exposure, if this had already been pushed with the real key in it.

## Self-Check
- [ ] No literal API key string appears anywhere in `tba_client.py`
- [ ] The script reads `API_KEY` from an environment variable and still runs correctly with it set
- [ ] `.env.example` exists with the variable's name and a placeholder value, not a real one
- [ ] A `.gitignore` entry excludes `.env` from being committed
- [ ] I can state why "delete it in a later commit" doesn't undo a real exposure, once pushed

## Reflection
Nothing about this fix made the script more complicated to run. It still needs exactly one thing set before it works, the same as before. What changed is where that one thing lives: outside the repository entirely, instead of inside a file `git` is permanently recording the history of. That's the whole practice this exercise is building: not "remember to be careful with secrets," which fails the first time someone's in a hurry, but "secrets structurally can't end up in a commit," which doesn't depend on anyone remembering anything at all.
