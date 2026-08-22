class Drivetrain:
    def __init__(self):
        self.left_motor_power = 0.0
        self.right_motor_power = 0.0
        self.power_history = []


# Tightly coupled: reaches directly into Drivetrain's public attributes
def adjust_heading(dt):
    dt.left_motor_power = dt.left_motor_power * 0.9
    dt.power_history.append(dt.left_motor_power)


def main():
    dt = Drivetrain()
    dt.left_motor_power = 0.8
    dt.right_motor_power = 0.8

    adjust_heading(dt)
    adjust_heading(dt)
    adjust_heading(dt)

    print(f"Final left power: {dt.left_motor_power}")
    print(f"Power history: {dt.power_history}")


if __name__ == "__main__":
    main()
