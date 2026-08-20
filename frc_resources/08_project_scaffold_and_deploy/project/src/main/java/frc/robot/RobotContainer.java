package frc.robot;

import edu.wpi.first.wpilibj2.command.Command;
import edu.wpi.first.wpilibj2.command.Commands;
import edu.wpi.first.wpilibj2.command.button.CommandXboxController;

import frc.robot.commands.RunIntakeCommand;
import frc.robot.subsystems.IntakeSubsystem;

// Owns every subsystem, binds controller input to commands, and exposes
// whatever the autonomous period should run -- the one place in the project
// that ties hardware (subsystems), behavior (commands), and driver input
// together.
public class RobotContainer {
    private final IntakeSubsystem intake = new IntakeSubsystem();
    private final CommandXboxController driverController =
        new CommandXboxController(Constants.OperatorConstants.DRIVER_CONTROLLER_PORT);

    public RobotContainer() {
        configureBindings();
    }

    private void configureBindings() {
        // Holding the right bumper runs RunIntakeCommand until it finishes
        // on its own (piece detected) or the button is released, whichever
        // comes first -- whileTrue() cancels the command automatically the
        // moment the trigger condition goes false.
        driverController.rightBumper().whileTrue(new RunIntakeCommand(intake));
    }

    public Command getAutonomousCommand() {
        // A real project typically returns a SendableChooser-selected
        // routine here (see frc_resources/04_dashboards_and_telemetry for
        // where that selection shows up on Elastic). This reference
        // skeleton keeps it simple: run the intake for at most two seconds,
        // whichever finishes first -- Commands.deadline() is a composition
        // helper, not a hand-rolled state machine, doing the same kind of
        // "run until X, with a safety bound" job as
        // back_end_resources/systems_primer/03_state_machines' INTAKE state.
        return Commands.deadline(Commands.waitSeconds(2.0), new RunIntakeCommand(intake));
    }
}
