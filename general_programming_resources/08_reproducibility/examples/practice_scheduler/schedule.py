import random

PRACTICE_LOG_PATH = "/Users/coach/robotics/practice_data.csv"


def assign_practice_slots(robots, slots):
    shuffled = robots[:]
    random.shuffle(shuffled)
    return dict(zip(slots, shuffled))


def log_assignment(assignment):
    with open(PRACTICE_LOG_PATH, "a") as f:
        for slot, robot in assignment.items():
            f.write(f"{slot},{robot}\n")


if __name__ == "__main__":
    robots = ["Robot A", "Robot B", "Robot C"]
    slots = ["9:00", "9:20", "9:40"]

    assignment = assign_practice_slots(robots, slots)
    for slot, robot in assignment.items():
        print(f"{slot}: {robot}")

    log_assignment(assignment)
