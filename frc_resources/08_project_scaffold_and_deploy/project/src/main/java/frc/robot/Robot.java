package frc.robot;

import edu.wpi.first.wpilibj.TimedRobot;
import edu.wpi.first.wpilibj2.command.Command;
import edu.wpi.first.wpilibj2.command.CommandScheduler;

// TimedRobot IS the periodic loop back_end_resources/systems_primer/01's
// concept.md describes in the abstract: WPILib calls this class's periodic
// methods on a fixed ~20ms schedule for the whole match. robotPeriodic()
// below is where that loop actually reaches the CommandScheduler -- and
// therefore every Subsystem's periodic() and every running Command's
// execute() -- once per tick.
public class Robot extends TimedRobot {
    private final RobotContainer robotContainer;
    private Command autonomousCommand;

    public Robot() {
        robotContainer = new RobotContainer();
    }

    @Override
    public void robotPeriodic() {
        // The one call that makes everything else in this project's
        // periodic loop happen. Skipping this line is a real, easy-to-make
        // mistake that silently breaks every subsystem's periodic() and
        // every command's execute() at once -- nothing else in this class
        // does that.
        CommandScheduler.getInstance().run();
    }

    @Override
    public void autonomousInit() {
        autonomousCommand = robotContainer.getAutonomousCommand();
        if (autonomousCommand != null) {
            autonomousCommand.schedule();
        }
    }

    @Override
    public void teleopInit() {
        // Cancel whatever autonomous command is still running the instant
        // teleop starts -- without this, an unfinished auto routine could
        // keep fighting a driver for the same subsystem through the start
        // of teleop.
        if (autonomousCommand != null) {
            autonomousCommand.cancel();
        }
    }
}
