#!/bin/bash
# find_todos_and_errors.sh
#
# Meant to give a quick pre-practice summary, run from inside sample_project/:
#   1. Every open TODO left in the code
#   2. How many ERROR lines showed up in the last match log

echo "== Open TODOs in src/ =="
grep -n "TODO" src/*.java

echo
echo "== Errors in logs/match_12.log =="
grep -c "ERROR" logs/match_12.log
