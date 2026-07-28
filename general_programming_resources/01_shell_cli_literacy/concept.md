# 01 - Shell & CLI Literacy

## What a shell actually is

A **shell** is a program whose entire job is to read a line of text you type, figure out what program you meant, run it, and show you what it printed back. The "terminal" is just the window the shell happens to live in — on Mac/Linux it's usually `zsh` or `bash`; on Windows it's PowerShell or, increasingly, the same `bash`/`zsh` running inside WSL. When you type `python3 train.py` or `git status` or `javac Robot.java`, you're not doing anything mysterious — you're asking the shell to find a program named `python3`/`git`/`javac` and run it with the arguments you gave it. Every tool you already use — an IDE's "Run" button, a build system, a deploy script — is, underneath, doing exactly this. Learning the shell directly just means you're no longer limited to the handful of buttons someone else decided to expose in a GUI.

This is the one module in this folder worth treating as a soft prerequisite for the rest. `03_file_project_structure`, `06_debugging_methodology`, `08_reproducibility`, and `10_reading_unfamiliar_code` all assume you can already navigate and search from a terminal without it slowing you down.

## Navigation: where am I, what's here, where do I go

Three commands cover almost everything:

| Command | Does |
|---|---|
| `pwd` | print working directory — where the shell currently thinks you are |
| `ls` (`ls -la`) | list what's in the current directory (`-l` = detailed, `-a` = include hidden dotfiles) |
| `cd <path>` | change directory — move somewhere else |

The part that trips people up isn't the commands, it's **paths**. `cd subsystems` is a *relative* path — "go into a folder named `subsystems`, starting from wherever I already am." `cd /Users/you/robot-code/src` is an *absolute* path — "go here, full stop, regardless of where I started." `cd ..` goes up one level, `cd ~` goes to your home directory, and `cd -` jumps back to wherever you just were. Almost every "command not found" or "no such file or directory" error a beginner hits is a path problem: you're not where you think you are, or the file isn't where you think it is. `pwd` and `ls` are how you check, instead of guessing.

## File operations

`mkdir` (make a directory), `touch` (create an empty file), `cp` (copy), `mv` (move *or* rename — same command, since renaming is just "move to a new name in the same place"), and `rm` (remove). `rm` deserves a specific warning: there is no trash can. `rm -rf some_folder` deletes it immediately and permanently, no confirmation, no undo. Get comfortable with `ls` before you `rm` — see what's actually there before you delete it.

## Flags, and reading `--help`

Almost every command you run takes optional **flags** that change its behavior — `ls -la` isn't one command, it's `ls` plus the `-l` and `-a` flags. You are not expected to memorize every flag for every tool. You're expected to know how to ask the tool what it can do: `<command> --help` prints a usage summary for almost any modern CLI tool, and `man <command>` (manual page) gives the full, often much longer, reference for most standard Unix tools. Reading a `--help` or `man` page is its own skill — skim for the flag that sounds like what you want, don't read it top to bottom like a novel — but it's the single most transferable habit in this module: it works for a tool you've used a hundred times and one you've never seen before.

## Piping and redirects

The shell lets you connect commands together instead of running them one at a time and copying results by hand:

- **`|` (pipe)** sends one command's output straight into another command's input. `cat match_12.log | grep ERROR` means "print the log, then hand every line of that output to `grep`, which only keeps the ones containing `ERROR`."
- **`>`** redirects output into a file, *replacing* whatever was there. `ls -la > listing.txt` writes the directory listing into `listing.txt` instead of printing it to your screen.
- **`>>`** does the same thing but *appends* to the end of the file instead of overwriting it.

This is the same idea as function composition: instead of one command doing everything, you chain small, single-purpose commands together, each one doing the one thing it's good at.

## Search tools: `grep` and `find`

These two do almost all the "where is the thing I'm looking for" work you'll ever need from a shell:

- **`grep <pattern> <file>`** searches *inside* files for lines matching a pattern. `grep -r "TODO" src/` searches recursively (`-r`) through every file under `src/` for the text `TODO`. `grep -i` ignores case, `grep -n` shows line numbers, `grep -c` just counts matches instead of printing them.
- **`find <path> -name "<pattern>"`** searches for *files themselves* by name, type, or other properties, not their contents. `find . -name "*.java"` finds every Java file anywhere under the current directory, no matter how deeply nested.

The distinction matters: `grep` looks inside files, `find` looks for files. You'll frequently combine them — find every file matching some pattern, then grep inside each one — and you'll lean on both heavily in `10_reading_unfamiliar_code`, where "where is the thing I'm looking for" is the entire problem.

## Environment variables

An **environment variable** is a named value the shell (and every program it launches) can read — `echo $PATH` prints one of the most important ones: the list of directories the shell searches, in order, whenever you type a command name, looking for a program with that name. "Command not found" frequently just means the program either isn't installed, or is installed somewhere not listed in `$PATH`. `export SOME_VAR=value` sets one for your current shell session. You don't need to master configuring these yet — just recognize that `$PATH`, `$HOME`, and similar variables are why the same command works from any folder, and why installing a tool sometimes requires a "restart your terminal" step (so it re-reads an updated `$PATH`).

## Enough scripting to chain a few commands

A **shell script** is just a text file full of the same commands you'd type by hand, run all at once instead of one at a time. A file starting with `#!/bin/bash` and made executable (`chmod +x script.sh`) can be run directly (`./script.sh`); otherwise `bash script.sh` runs it regardless. You don't need loops or functions to get real value out of this yet — even a two- or three-line script that chains a `find`, a `grep`, and a redirect together turns something you'd otherwise retype by hand into something you run once and reuse.

## Putting it together

Open a terminal in `examples/sample_project/` and, without opening any file in an editor first, use only `pwd`, `ls`, `cd`, `find`, and `grep` to answer: how many `.java` files exist, how many still have a `TODO` comment, and how many `ERROR` lines show up in `logs/match_12.log`. Then open `examples/broken_script.sh` — it's supposed to answer two of those same questions automatically, but it gets one of them wrong. Figure out why before moving to `exercises/`.

## Resources

- [The Missing Semester of Your CS Education (MIT)](https://missing.csail.mit.edu/) - a full, free course built entirely around exactly this material (shell, `grep`/`find`, environment variables, and more), going considerably deeper than this page does.
- [explainshell.com](https://explainshell.com/) - paste in any confusing command you find online and it breaks down every flag piece by piece.
- [Julia Evans: Bite Size Command Line](https://wizardzines.com/zines/bite-size-command-line/) - short, approachable, cartoon-illustrated deep dives on individual tools like `grep` and `find`.
