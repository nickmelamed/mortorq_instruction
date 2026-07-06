// 09 - Configuration & Constants Management: a WPILib-style constants file
//
// Organized by subsystem, exactly like a real WPILib Constants.java would
// be: nested, final, static classes, one per subsystem or concern, so a
// value's location tells you what it's for before you even read its name.
//
// ACTIVE_PROFILE is the practice-bot/competition-bot switch described in
// concept.md: flip this one line (and recompile) to deploy the same
// codebase to either robot, instead of hand-editing values throughout the
// code before every practice session or match. A real team with a physical
// difference they can read at startup (a jumper wire, a DIO pin tied high
// or low on one robot and not the other) could instead set this from that
// reading at boot time, so the exact same compiled code works correctly
// on whichever robot it happens to be running on. See ConfigPatternDemo.java.
public final class Constants {

    private Constants() {} // just a namespace for constants

    public enum RobotProfile {
        PRACTICE_BOT,
        COMP_BOT
    }

    public static final RobotProfile ACTIVE_PROFILE = RobotProfile.COMP_BOT;

    public static final class DrivetrainConstants {
        private DrivetrainConstants() {}

        // The practice bot's chassis measures slightly differently from the
        // competition bot's exactly, hence the profile switch 
        public static final double WHEEL_DIAMETER_INCHES =
            (ACTIVE_PROFILE == RobotProfile.COMP_BOT) ? 4.00 : 3.85;

        public static final double GEAR_RATIO = 8.45;
        public static final double MAX_SPEED_METERS_PER_SECOND = 4.5;
        public static final double TRACK_WIDTH_METERS = 0.65;
    }

    public static final class IntakeConstants {
        private IntakeConstants() {}

        public static final int MOTOR_CAN_ID = 10;
        public static final double INTAKE_POWER = 0.65;
        public static final double PIECE_DETECTED_CURRENT_THRESHOLD_AMPS = 20.0;
    }

    public static final class ArmPidConstants {
        private ArmPidConstants() {}

        // PID gains tuned per-robot, same reasoning as the wheel diameter
        // above: the practice bot's arm doesn't respond identically to the
        // competition bot's, even running the same code.
        public static final double KP = (ACTIVE_PROFILE == RobotProfile.COMP_BOT) ? 0.060 : 0.050;
        public static final double KI = 0.020;
        public static final double KD = 0.006; // see 04_control_loops_pid's PidLoopDemo.java for why not 0.01

        public static final double SETPOINT_DEGREES = 90.0;
    }
}
