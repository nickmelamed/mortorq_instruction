"""
Usage:
  python3 run_tests.py            # runs the two tests in one order
  python3 run_tests.py reversed   # runs them in the opposite order

A tiny stand-in for a real test runner (like pytest or JUnit), just enough
to show that these two tests don't behave the same way in every order.
"""
import sys

import test_score_tracker as tests


def run(order):
    print(f"Running in order: {order}")
    for name in order:
        test_func = getattr(tests, name)
        try:
            test_func()
            print(f"  {name}: PASS")
        except AssertionError as e:
            print(f"  {name}: FAIL ({e})")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "reversed":
        run(["test_add_multiple_scores", "test_add_single_score"])
    else:
        run(["test_add_single_score", "test_add_multiple_scores"])
