import random

# Seeded on purpose so behavior is reproducible before/after refactoring
# (you'll see why that matters in 08_reproducibility).
random.seed(42)


def do_stuff():
    x = read_sensor()
    flag2 = False

    if x > 10:
        y = x * 0.5
        flag2 = True
    else:
        y = x * 2

    print(f"[LOG] sensor={x} output={y}")

    drive_motor(y)

    if flag2:
        print("[LOG] entering hold mode")


def read_sensor():
    return random.random() * 20


def drive_motor(power):
    print(f"Driving motor at power {power}")


if __name__ == "__main__":
    for _ in range(3):
        do_stuff()
