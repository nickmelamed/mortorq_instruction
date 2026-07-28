"""
Usage: python3 check_version.py v3

Checks one version file's total_score against a known-correct expected result.
This is a hand-rolled stand-in for what `git bisect run` does automatically
against a real test command.
"""
import importlib
import sys

EXPECTED = 47  # total_score(auto=10, teleop=20, endgame=15, penalties=3)


def main():
    version = sys.argv[1]
    module = importlib.import_module(f"versions.{version}")
    result = module.total_score(10, 20, 15, 3)

    if result == EXPECTED:
        print(f"{version}: PASS (total_score = {result})")
    else:
        print(f"{version}: FAIL (total_score = {result}, expected {EXPECTED})")


if __name__ == "__main__":
    main()
