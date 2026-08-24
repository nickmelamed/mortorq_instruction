"""
An ice-cream-cone-shaped suite: three slow "full scenario" tests, none of
them touching an individual function directly. The sleep() calls stand in
for the real cost of a suite like this -- spinning up a full system for
every case instead of calling one small function directly.
"""
import time

from match_scoring import total_match_score


def test_scenario_normal_score():
    time.sleep(0.5)
    assert total_match_score(50, 10) == 50


def test_scenario_high_score_with_bonus():
    time.sleep(0.5)
    assert total_match_score(95, 4) == 100


def test_scenario_low_score():
    time.sleep(0.5)
    assert total_match_score(-10, 10) == 0


if __name__ == "__main__":
    tests = [test_scenario_normal_score, test_scenario_high_score_with_bonus, test_scenario_low_score]
    start = time.perf_counter()
    for test in tests:
        try:
            test()
            print(f"{test.__name__}: PASS")
        except AssertionError as e:
            print(f"{test.__name__}: FAIL ({e})")
    print(f"total time: {time.perf_counter() - start:.2f}s")
