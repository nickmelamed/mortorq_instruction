class Drivetrain:
    def __init__(self):
        self.left_power = 0.0
        self.right_power = 0.0

    def set_powers(self, left, right):
        self.left_power = left
        self.right_power = right

    def stop(self):
        self.set_powers(0.0, 0.0)
