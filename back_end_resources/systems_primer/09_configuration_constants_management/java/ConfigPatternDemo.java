// 09 - Configuration & Constants Management: consuming Constants.java
//
// Every value below is read from Constants rather than hardcoded here --
// that's the entire pattern. Compare how little this file says about
// what the numbers are: it just names which constant it needs, and
// Constants.java is the one place that actually documents and owns each value.
//
// Compile and run directly, no dependencies:
//   $ javac ConfigPatternDemo.java Constants.java
//   $ java ConfigPatternDemo
public class ConfigPatternDemo {

    public static void main(String[] args) {
        System.out.println("Active profile: " + Constants.ACTIVE_PROFILE);
        System.out.println();

        // Drivetrain code reaches for Constants.DrivetrainConstants instead
        // of a bare literal. If something's wrong, easy fix. 
        double wheelCircumferenceInches =
            Constants.DrivetrainConstants.WHEEL_DIAMETER_INCHES * Math.PI;
        System.out.printf("wheel diameter:      %.2f in%n", Constants.DrivetrainConstants.WHEEL_DIAMETER_INCHES);
        System.out.printf("wheel circumference: %.2f in%n", wheelCircumferenceInches);
        System.out.printf("gear ratio:          %.2f:1%n", Constants.DrivetrainConstants.GEAR_RATIO);

        System.out.println();
        System.out.printf("intake power:        %.2f%n", Constants.IntakeConstants.INTAKE_POWER);
        System.out.printf("current threshold:   %.1f A%n",
            Constants.IntakeConstants.PIECE_DETECTED_CURRENT_THRESHOLD_AMPS);

        System.out.println();
        System.out.printf("arm PID gains:       kP=%.3f kI=%.3f kD=%.3f%n",
            Constants.ArmPidConstants.KP, Constants.ArmPidConstants.KI, Constants.ArmPidConstants.KD);

        // The point of this whole pattern: flip Constants.ACTIVE_PROFILE
        // from COMP_BOT to PRACTICE_BOT (and recompile) and every value
        // above that depends on it updates with no other line in this file,
        // or anywhere else in the codebase, needing to change at all.
        System.out.println();
        System.out.println("Switching Constants.ACTIVE_PROFILE to PRACTICE_BOT would change "
            + "WHEEL_DIAMETER_INCHES and KP above (and anything else that depends on the profile), "
            + "with nothing in this file needing to change to pick up the new values.");
    }
}
