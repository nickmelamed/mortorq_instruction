"""
Usage: python3 benchmark.py

Times naive_find_duplicate and fast_find_duplicate against growing input
sizes, with no actual duplicate present -- forcing both functions through
their full worst case, where every entry has to be checked before
concluding there's no match.
"""
import time

from find_duplicates import make_entries, naive_find_duplicate, fast_find_duplicate


def time_it(func, entries):
    start = time.perf_counter()
    func(entries)
    return time.perf_counter() - start


def main():
    print(f"{'n':>6} {'naive (s)':>12} {'fast (s)':>12}")
    for n in [500, 1000, 2000, 4000, 8000]:
        entries = make_entries(n, inject_duplicate=False)
        naive_time = time_it(naive_find_duplicate, entries)
        fast_time = time_it(fast_find_duplicate, entries)
        print(f"{n:6d} {naive_time:12.4f} {fast_time:12.6f}")


if __name__ == "__main__":
    main()
