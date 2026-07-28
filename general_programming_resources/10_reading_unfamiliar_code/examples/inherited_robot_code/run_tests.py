"""
Usage: python3 run_tests.py

A tiny stand-in for a real test runner -- just enough to run this project's
existing tests directly.
"""
from tests import test_sequencer


def main():
    test_sequencer.test_sequence_completes_in_four_ticks()
    print("test_sequence_completes_in_four_ticks: PASS")
    test_sequencer.test_sequence_ends_with_arm_at_rest()
    print("test_sequence_ends_with_arm_at_rest: PASS")


if __name__ == "__main__":
    main()
