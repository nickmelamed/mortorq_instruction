from score_tracker import ScoreTracker

# Created once, at import time -- shared by every test function below.
tracker = ScoreTracker()


def test_add_single_score():
    tracker.add_score(10)
    assert tracker.total() == 10


def test_add_multiple_scores():
    tracker.add_score(20)
    assert tracker.total() == 20
