package frc.robot.subsystems;

import edu.wpi.first.wpilibj.DigitalInput;
import edu.wpi.first.wpilibj.motorcontrol.PWMSparkMax;
import edu.wpi.first.wpilibj2.command.SubsystemBase;

import frc.robot.Constants.IntakeConstants;

// A Subsystem owns one piece of hardware and exposes what it can do --
// exactly the definition back_end_resources/systems_primer/03_state_machines'
// "state machines vs. command-based programming" section gives it. Uses
// core WPILib's PWMSparkMax rather than a vendor CAN motor controller
// (REVLib's SparkMax, CTRE's TalonFX -- see frc_resources/06_hardware_debugging)
// specifically so this reference skeleton doesn't depend on a vendor
// library's API, which changes yearly -- see ../../../README.md ("Why
// PWMSparkMax instead of a real CAN motor controller") for the full reasoning.
// A real competition intake almost always runs on CAN, not PWM.
public class IntakeSubsystem extends SubsystemBase {
    private final PWMSparkMax motor = new PWMSparkMax(IntakeConstants.MOTOR_PWM_CHANNEL);
    private final DigitalInput pieceSensor = new DigitalInput(IntakeConstants.PIECE_SENSOR_DIO_CHANNEL);

    @Override
    public void periodic() {
        // Called once per tick by CommandScheduler.run() (see Robot.java) --
        // the same periodic loop model from systems_primer/01, just reached
        // through the real scheduler instead of a hand-written while loop.
        // This subsystem has no per-tick logic of its own beyond what its
        // sensor/motor already do, but this is exactly where it would go --
        // e.g. publishing a NetworkTables value (systems_primer/02).
    }

    public void runIntake() {
        motor.set(IntakeConstants.INTAKE_POWER);
    }

    public void stop() {
        motor.set(0.0);
    }

    public boolean hasPiece() {
        // A real beam-break sensor's wiring/polarity determines whether it
        // reads LOW or HIGH when broken -- always verify against the actual
        // sensor's datasheet before trusting this, the same "check the
        // physical layer, don't assume" instinct as
        // frc_resources/06_hardware_debugging SS1.
        return !pieceSensor.get();
    }
}
