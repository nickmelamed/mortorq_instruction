from subsystems.drivetrain import Drivetrain
from subsystems.intake import Intake
from subsystems.arm import Arm


class AutoSequencer:
    """Runs a fixed sequence of actions during the autonomous period."""

    def __init__(self):
        self.drivetrain = Drivetrain()
        self.intake = Intake()
        self.arm = Arm()
        self.step = 0
        self.log = []

    def tick(self):
        if self.step == 0:
            self.drivetrain.set_powers(0.5, 0.5)
            self.log.append("driving forward")
        elif self.step == 1:
            self.drivetrain.stop()
            self.intake.start()
            self.log.append("intake started")
        elif self.step == 2:
            self.intake.stop()
            self.arm.move_to(90)
            self.log.append("arm raised")
        elif self.step == 3:
            self.arm.rest()
            self.log.append("arm resting")
        self.step += 1
        return self.step > 3
