# 01 - Shell & CLI Literacy

## What is a Shell?

A **shell** is a program whose entire job is to read a line of text you type, figure out what program you meant, run it, and show you what it printed back. The "terminal" is just the window the shell happens to live in.

On Mac/Linux it's usually `zsh` or `bash`. On Windows it's PowerShell or, increasingly, the same `bash`/`zsh` running inside WSL. When you type `python3 train.py` or `git status` or `javac Robot.java`, you're not doing anything mysterious; you're asking the shell to find a program named `python3`/`git`/`javac` and run it with the arguments you gave it.

Every tool you already use — an IDE's "Run" button, a build system, a deploy script — is, underneath, doing this. Learning the shell directly just means you're no longer limited to the handful of buttons someone else decided to expose in a GUI (Graphical User Interface) like VSCode.

This fluency matters beyond this curriculum, too. Modern AI coding assistants and agentic tools work by running shell commands on your behalf and showing you what happened. `ai_resources/agent_primer/11-agentic-coding-tools.md` covers those tools directly; the fluency this module teaches is what makes that chapter make sense.

This is the one module in this folder worth treating as a soft prerequisite for the rest. `03_file_project_structure`, `06_debugging_methodology`, `08_reproducibility`, and `10_reading_unfamiliar_code` all assume you can already navigate and search from a terminal without it slowing you down.

## Navigation

Three commands cover almost everything:

| Command | Does |
|---|---|
| `pwd` | print working directory, which is where the shell currently thinks you are |
| `ls` (`ls -la`) | list what's in the current directory (`-l` = detailed, `-a` = include hidden dotfiles) |
| `cd <path>` | change directory, AKA move somewhere else |

For reference, dotfiles are files that start with `.` that are usually hidden because they contain things like user preferences, tools, etc. that often clutter the workspace. Also, for the `ls` command, note that the flags `-l` and `-a` are combined to make sure we get both a more detailed list as well as including the hidden dotfiles. We talk about flags shortly. 

The part that trips people up isn't the commands, it's **paths**. `cd subsystems` is a *relative* path; you're telling the shell "go into a folder named `subsystems`, starting from wherever I already am." `cd /Users/you/robot-code/src` is an *absolute* path; you're telling the shell "go here, full stop, regardless of where I started." `cd ..` goes up one level, `cd ~` goes to your home directory, and `cd -` jumps back to wherever you just were. Almost every "command not found" or "no such file or directory" error a beginner hits is a path problem. You're not where you think you are, or the file isn't where you think it is. `pwd` and `ls` are how you check, instead of guessing.

## Moving Faster: Tab Completion and History

- **Tab completion.** Start typing a file, folder, or command name and press `Tab`. The shell finishes it for you, or, if there's more than one match, shows you the options so you can narrow it down with one more letter and `Tab` again. It's a built-in spell-checker! If `Tab` doesn't complete anything, you've usually mistyped a path or you're not where you think you are, and you find out immediately instead of after an error message.
- **Command history.** The `↑` (up arrow) key cycles backward through commands you've already run, so a slightly-wrong command doesn't mean retyping the whole thing. When you press `↑`, edit the one part that was wrong, and rerun it. `Ctrl+R` starts an interactive search backward through your history, so if you start typing any part of a command you ran recently, and it jumps straight to it.

Use both constantly. Retyping a long path by hand is what makes the shell feel slower than a GUI, and it's friction that's completely avoidable.

## File Operations

| Command | Does |
|---|---|
| `mkdir <name>` | make a new directory |
| `touch <name>` | create an empty file, or update its timestamp if it already exists |
| `cp <src> <dst>` | copy a file (add `-r` to copy a folder) |
| `mv <src> <dst>` | move *or* rename — same command, since renaming is just "move to a new name in the same place" |
| `rm <name>` (`rm -rf <folder>`) | remove |

`rm` deserves a specific warning: there is no "trash can" to retrieve something once you delete it. `rm -rf some_folder` deletes it immediately and permanently, no confirmation, no undo.

## Reading and Understanding Permissions

Every file has an owner and a set of **permissions** controlling who can read, write, or execute it, and `ls -la` — already familiar from Navigation — prints them directly: a string like `-rwxr-xr-x` at the start of each line. The first character is the file type (`-` for a regular file, `d` for a directory); the next nine are three groups of three (`rwx`), for the file's owner, its group, and everyone else, in that order — `r` (read), `w` (write), `x` (execute). A script without its `x` bit set can't be run directly, no matter how correct the code inside it is. That's exactly what `chmod +x script.sh`, used later in "Scripting," is doing; adding the execute permission for you, the owner, so `./script.sh` is even allowed to run. You don't need to memorize the numeric form (`chmod 755`) to get real value here, just enough to read `ls -la`'s output and know why a script you just wrote is refusing to run until you've made it executable.

Sometimes permissions block you even after `chmod`. This could be a file you don't own, or a change that requires administrator access altogether, not just the right bit set on a file that's already yours. `sudo` ("superuser do") runs a single command with full administrator privileges, bypassing the permission check entirely. That's exactly why it deserves more caution than any command covered so far: without `sudo`, a typo in a dangerous command usually just fails with "permission denied"; with it, that same typo is free to actually happen. Never run a `sudo` command you copy-pasted from somewhere without reading and understanding it first.


## Flags, and Reading `--help`

Almost every command you run takes optional **flags** that change its behavior. As we talked about above, `ls -la` isn't one command, it's `ls` plus the `-l` and `-a` flags. You are not expected to memorize every flag for every tool. You're expected to know how to ask the tool what it can do: `<command> --help` prints a usage summary for almost any modern CLI tool, and `man <command>` (manual page) gives the full, often much longer, reference for most standard Unix tools. Reading a `--help` or `man` page is its own skill, and it's the single most transferable habit in this module: it works for a tool you've used a hundred times and one you've never seen before.

Naturally, as you use certain commands more (like `mkdir`) you'll memorize a few, but the point here is that you never actually *have* to memorize anything so long as you know how to look up the documentation properly.

## Piping and Redirects

The shell lets you connect commands together instead of running them one at a time:

- **`|` (pipe)** sends one command's output straight into another command's input. `cat match_12.log | grep ERROR` means "print the log, then hand every line of that output to `grep`, which only keeps the ones containing `ERROR`."
- **`>`** redirects output into a file, *replacing* whatever was there. `ls -la > listing.txt` writes the directory listing into `listing.txt` instead of printing it to your screen.
- **`>>`** does the same thing but *appends* to the end of the file instead of overwriting it.

This is the same idea as function composition: instead of one command doing everything, you chain small, single-purpose commands together, each one doing the one thing it's good at.

## Standard Streams and Exit Codes

Every running program has built-in channels called **standard streams**: it reads from **stdin** (standard input), and writes to **stdout** (standard output) for normal output and **stderr** (standard error) for error messages. They are two *separate* channels, even though both usually print to the same terminal window and look identical to you. This is exactly what `>` from the last section actually redirects: only stdout. Redirect a command's output to a file, and an error message can still show up on your screen, which confuses almost everyone the first time it happens. The fix is `2>`, which redirects stderr specifically (`some_command 2> errors.txt`), or `2>&1` after a `>` to send both streams to the same place.

The other thing every command leaves behind when it finishes is an **exit code**: a number, `0` for success and anything else for failure, that the shell can check even though it's never printed anywhere on its own. `echo $?` immediately after running something prints the exit code of whatever you just ran. 

## Chaining Commands: `&&`, `||`, and `;`

The shell can also decide whether to run a second command *based on* whether the first one succeeded, using the exit codes from the last section:

- **`&&`** runs the next command only if the previous one exited `0` (succeeded). `mkdir build && cd build` only moves into `build/` if creating it actually worked; if `mkdir` failed, `cd` never runs, instead of failing confusingly on a folder that doesn't exist.
- **`||`** runs the next command only if the previous one exited non-zero (failed); commonly used as a fallback: `some_command || echo "that didn't work"`.
- **`;`** just runs commands one after another regardless of what happened, with no dependency between them at all.

This is worth being deliberate about, not just habitual: `&&` when the second command genuinely depends on the first succeeding, `;` when it doesn't, and `||` when you want a specific fallback instead of the whole line dying silently at the first failure.

## Search Tools: `grep` and `find`

These two do almost all the "where is the thing I'm looking for" work you'll ever need from a shell:

- **`grep <pattern> <file>`** searches *inside* files for lines matching a pattern. `grep -r "TODO" src/` searches recursively (`-r`) through every file under `src/` for the text `TODO`. `grep -i` ignores case, `grep -n` shows line numbers, `grep -c` just counts matches instead of printing them.
- **`find <path> -name "<pattern>"`** searches for *files themselves* by name, type, or other properties, not their contents. `find . -name "*.java"` finds every Java file anywhere under the current directory, no matter how deeply nested.

The distinction matters. `grep` looks inside files, `find` looks for files. You'll frequently combine them — find every file matching some pattern, then grep inside each one — and you'll lean on both heavily in `10_reading_unfamiliar_code`, where "where is the thing I'm looking for" is the entire problem.

## Environment Variables

An **environment variable** is a named value the shell (and every program it launches) can read; `echo $PATH` prints one of the most important ones: the list of directories the shell searches, in order, whenever you type a command name, looking for a program with that name. "Command not found" frequently just means the program either isn't installed, or is installed somewhere not listed in `$PATH`. `export SOME_VAR=value` sets one for your current shell session. You don't need to master configuring these yet, you just need to recognize that `$PATH`, `$HOME`, and similar variables are why the same command works from any folder, and why installing a tool sometimes requires a "restart your terminal" step (so it re-reads an updated `$PATH`).

## Scripting to Chain a Few Commands

A **shell script** is just a text file full of the same commands you'd type by hand, run all at once instead of one at a time. A file starting with `#!/bin/bash` and made executable (`chmod +x script.sh`, from "Reading and Understanding Permissions" above) can be run directly (`./script.sh`); otherwise `bash script.sh` runs it regardless. You don't need loops or functions to get real value out of this yet; even a two- or three-line script that chains a `find`, a `grep`, and a redirect together turns something you'd otherwise retype by hand into something you run once and reuse. The `&&`/`||`/exit-code habits from above are exactly how a real script decides what to do when one of its own steps fails.

## Controlling Processes

Every running program is a **process**, and the shell gives you a few direct ways to control one:

- **`Ctrl+C`** sends an interrupt signal, asking the currently running program to stop immediately. This is the answer to "something's stuck and I want my terminal back".
- **`&`** at the end of a command runs it in the **background**, immediately giving you your prompt back instead of waiting for it to finish (`long_task.sh &`). `jobs` lists what's running in the background of your current shell session.
- **`Ctrl+Z`** pauses (doesn't kill) whatever's currently running in the foreground and hands control back to you; `fg` resumes it in the foreground, `bg` resumes it in the background.
- **`ps`** lists running processes, and **`kill <pid>`** sends a stop signal to one directly, by its process ID. This is the tool of last resort for something `Ctrl+C` didn't stop.

One specific, extremely common version of "something's stuck and I don't know how to get out": if a command (often `git commit` with no `-m`, or just typing `vim`/`vi` by accident) drops you into a full-screen text editor you didn't mean to open, don't panic; press `Esc`, then type `:q!` and hit `Enter` to quit without saving.

## Putting it Together

Open a terminal in `examples/sample_project/` and, without opening any file in an editor first, use only `pwd`, `ls`, `cd`, `find`, and `grep` to answer: how many `.java` files exist, how many still have a `TODO` comment, and how many `ERROR` lines show up in `logs/match_12.log`. Then open `examples/broken_script.sh`; it's supposed to answer two of those same questions automatically, but it gets one of them wrong. Figure out why before moving to `exercises/`, where five exercises pick up different pieces of this module: orientation and search, fixing the broken script, hands-on file operations and permissions, tracing stdout/stderr/exit codes through `examples/stream_check.sh`, and reading real `--help` output alongside environment variables. Use tab-completion and your command history throughout instead of retyping paths by hand.

## See also

- **`03_file_project_structure`** — the `ls`/`find`-driven orientation this module teaches, aimed one level up at a whole project's layout instead of one command's output.
- **`06_debugging_methodology`** — reading a traceback in a terminal and running a debugger both assume the comfort this module treats as a soft prerequisite.
- **`08_reproducibility`** — environment variables and exit codes both show up again there, as two of the most common hidden causes of "works on my machine."
- **`10_reading_unfamiliar_code`** — `grep` and `find`, used constantly, are the entire mechanism behind that module's "search before reading linearly" strategy.
- **`ai_resources/agent_primer/11-agentic-coding-tools.md`** — the fluency this module teaches, reading command output and telling a safe command from a destructive one, is exactly what makes working alongside an agentic coding tool legible instead of a black box.

## Resources

- [The Missing Semester of Your CS Education (MIT)](https://missing.csail.mit.edu/) - a full, free course built entirely around exactly this material (shell, `grep`/`find`, environment variables, and more), going considerably deeper than this page does.
- [explainshell.com](https://explainshell.com/) - paste in any confusing command you find online and it breaks down every flag piece by piece.
- [Julia Evans: Bite Size Command Line](https://wizardzines.com/zines/bite-size-command-line/) - short, approachable, cartoon-illustrated deep dives on individual tools like `grep` and `find`.
