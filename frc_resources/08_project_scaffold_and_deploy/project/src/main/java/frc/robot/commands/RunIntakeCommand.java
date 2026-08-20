package frc.robot.commands;

import edu.wpi.first.wpilibj2.command.Command;

import frc.robot.subsystems.IntakeSubsystem;

// Runs the intake until a piece is detected, then stops -- the same
// initialize()/execute()/isFinished()/end() lifecycle
// back_end_resources/systems_primer/03_state_machines' "state machines vs.
// command-based programming" section describes, here as a real, reusable
// Command instead of one branch of a hand-rolled state machine.
//
// As of the 2024 season, Command is a plain interface with no-op default
// methods for initialize()/execute()/end() -- "implements Command" is
// correct here. Older WPILib code (and a lot of tutorials/forum posts still
// online) has you extend an abstract CommandBase class instead; CommandBase
// was removed, so code written against it won't compile against a current
// WPILib version. If an example you copied from elsewhere won't compile,
// this is one of the first things worth checking.
public class RunIntakeCommand implements Command {
    private final IntakeSubsystem intake;

    public RunIntakeCommand(IntakeSubsystem intake) {
        this.intake = intake;
        addRequirements(intake); // tells the CommandScheduler this command owns IntakeSubsystem
    }

    @Override
    public void initialize() {
        intake.runIntake();
    }

    @Override
    public boolean isFinished() {
        return intake.hasPiece();
    }

    @Override
    public void end(boolean interrupted) {
        intake.stop();
    }
}
