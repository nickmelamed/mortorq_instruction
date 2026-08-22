# Exercise 4: Trace the Streams

## Goal
Watch stdout, stderr, and exit codes behave as three genuinely separate things, then use an exit code to drive `&&`/`||` chaining directly.

## Scenario
`examples/stream_check.sh` does no real work; it exists purely so you can observe these three mechanisms in isolation. Every run prints one line to stdout and one line to stderr, and exits `0` if you gave it an argument, or `1` if you didn't.

## Steps
1. Run `bash examples/stream_check.sh` with no arguments and no redirects. Notice both lines print to your terminal, looking identical, even though they're not the same stream. Run `echo $?` right after, and what's the exit code?
   
2. Run it again as `bash examples/stream_check.sh > out.txt`. Which line ended up in `out.txt`, and which one still printed to your screen?
   
3. Run it a third time, this time with an argument and both streams redirected separately: `bash examples/stream_check.sh ready > out.txt 2> errors.txt`. Confirm nothing prints to your screen at all, then check both files — which stream went where
   
4. Run `echo $?` right after step 3's command. Compare it to step 1's exit code. Open `examples/stream_check.sh` and find the exact line that decides which exit code you get.
   
5. Write one line combining what you just learned: `bash examples/stream_check.sh && echo "succeeded" || echo "failed"`. Run it once with no argument and once with an argument (`bash examples/stream_check.sh ready && echo "succeeded" || echo "failed"`), and confirm the printed word matches what actually happened in each case.
   
6. Clean up: `rm out.txt errors.txt`.

## Self-Check
- [ ] I can state which stream (stdout or stderr) `>` alone redirected in step 2, and which one stayed on screen
- [ ] `out.txt` and `errors.txt` from step 3 each contain exactly one line, and I can say which is which without re-running the command
- [ ] I can explain, by pointing at the exact line in `stream_check.sh`, why the exit code differs between the no-argument and with-argument runs
- [ ] My `&&`/`||` one-liner from step 5 printed the correct word in both the failing and succeeding case

## Reflection
The point was watching three things that are normally invisible (which stream a line came from, and what exit code a command left behind) become visible and checkable. This is the exact mechanism underneath a CI pipeline reporting "build failed," a test runner printing red instead of green, or an agentic coding tool telling you a command it ran didn't work. All of it is `$?` and two separate streams, the same as what you just traced by hand in a five-line script.
