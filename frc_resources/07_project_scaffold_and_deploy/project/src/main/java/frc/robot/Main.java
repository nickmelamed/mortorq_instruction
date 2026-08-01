package frc.robot;

import edu.wpi.first.wpilibj.RobotBase;

// The entry point GradleRIO's build output and the roboRIO/Systemcore's own
// launcher both expect to find -- frc.robot.Main, calling RobotBase.startRobot().
// You'll essentially never edit this file: robot behavior belongs in Robot.java
// and everything it owns, not here.
public final class Main {
    private Main() {}

    public static void main(String... args) {
        RobotBase.startRobot(Robot::new);
    }
}
