package frc.robot;

// The same centralized-constants pattern taught in
// back_end_resources/systems_primer/09_configuration_constants_management,
// in its real project location. IntakeConstants.INTAKE_POWER below is the
// literal same value (0.65) as that module's Constants.java -- same idea,
// landed in a real WPILib project shape instead of a standalone demo.
public final class Constants {
    private Constants() {} // just a namespace for constants

    public static final class OperatorConstants {
        private OperatorConstants() {}

        public static final int DRIVER_CONTROLLER_PORT = 0;
    }

    public static final class IntakeConstants {
        private IntakeConstants() {}

        public static final int MOTOR_PWM_CHANNEL = 0;
        public static final int PIECE_SENSOR_DIO_CHANNEL = 0;
        public static final double INTAKE_POWER = 0.65; // see systems_primer/09's Constants.java
    }
}
