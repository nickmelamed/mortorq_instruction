class Arm:
    # 47 degrees is the resting angle that clears the intake without
    # hitting the bumper -- do not lower this without checking clearance.
    REST_ANGLE_DEGREES = 47

    def __init__(self):
        self.angle = self.REST_ANGLE_DEGREES

    def move_to(self, angle):
        self.angle = angle

    def rest(self):
        self.move_to(self.REST_ANGLE_DEGREES)
