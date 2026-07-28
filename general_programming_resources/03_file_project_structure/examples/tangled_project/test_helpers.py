from helpers import compute_average_cycle_time


def test_compute_average_cycle_time():
    matches = [{"cycle_time_seconds": "10"}, {"cycle_time_seconds": "20"}]
    assert compute_average_cycle_time(matches) == 15


if __name__ == "__main__":
    test_compute_average_cycle_time()
    print("test_compute_average_cycle_time passed")
