# old attempt before we split things into helpers.py -- superseded, keeping "just in case"
import csv


def main():
    with open("match_data.csv") as f:
        reader = csv.DictReader(f)
        times = [float(row["cycle_time_seconds"]) for row in reader]
    print(sum(times) / len(times))


main()
