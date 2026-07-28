from helpers import compute_average_cycle_time, load_matches


def main():
    matches = load_matches("match_data.csv")
    avg = compute_average_cycle_time(matches)
    print(f"Average cycle time: {avg:.2f}s")


if __name__ == "__main__":
    main()
