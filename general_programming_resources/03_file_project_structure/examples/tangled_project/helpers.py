import csv


def load_matches(path):
    with open(path) as f:
        reader = csv.DictReader(f)
        return [row for row in reader]


def compute_average_cycle_time(matches):
    times = [float(m["cycle_time_seconds"]) for m in matches]
    return sum(times) / len(times)
