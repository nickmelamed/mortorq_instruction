#!/bin/bash
# stream_check.sh
#
# Prints one line to stdout and one line to stderr, then exits 0 if it
# was given an argument, or 1 if it wasn't. No real work happens here.
# This exists purely so you can watch stdout, stderr, and exit codes
# behave independently of each other.

echo "stdout: this line is normal output"
echo "stderr: this line is an error message" >&2

if [ -z "$1" ]; then
    exit 1
else
    exit 0
fi
