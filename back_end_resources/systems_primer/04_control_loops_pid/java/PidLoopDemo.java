// 04 - Control Loops (PID): poll a sensor, decide, act
//
// SimplePIDController below is a minimal, hand-rolled version of the same
// idea as WPILib's real edu.wpi.first.math.controller.PIDController: given
// kP/kI/kD gains, a setpoint, and the current measurement, calculate()
// returns an output value meant to be sent straight to a motor. It's
// deliberately small enough to read top to bottom -- a real project should
// use WPILib's own PIDController rather than reimplementing this.
//
// There's no real motor or sensor here. SimulatedArm stands in for both: a
// mock system whose position moves a little every tick in response to
// whatever output the controller just produced, so you can watch it
// converge toward a setpoint over time instead of needing real hardware.
//
// Compile and run directly:
//   $ javac PidLoopDemo.java
//   $ java PidLoopDemo
public class PidLoopDemo {

    static class SimplePIDController {
        // Caps how much the accumulated integral can contribute to the
        // output. Without this, a long stretch of large error early on (the
        // arm is far from setpoint for many ticks) piles up in `integral`
        // and keeps pushing the output well after the error is gone -- a
        // classic PID bug called integral windup. Real WPILib PIDControllers
        // guard against this the same way, via setIntegratorRange().
        private static final double MAX_INTEGRAL = 5.0;

        private final double kP, kI, kD;
        private double integral = 0.0;
        private double previousError = 0.0;
        private boolean hasPreviousError = false;

        SimplePIDController(double kP, double kI, double kD) {
            this.kP = kP;
            this.kI = kI;
            this.kD = kD;
        }

        // Call this once per tick, exactly like a WPILib PIDController.
        // dtSeconds is the time since the last call -- here, a fixed 0.02s
        // to match the 20ms period from 01_concurrency_realtime_loops.
        double calculate(double measurement, double setpoint, double dtSeconds) {
            double error = setpoint - measurement;

            integral += error * dtSeconds;
            integral = Math.max(-MAX_INTEGRAL, Math.min(MAX_INTEGRAL, integral));

            double derivative = 0.0;
            if (hasPreviousError) {
                derivative = (error - previousError) / dtSeconds;
            }
            previousError = error;
            hasPreviousError = true;

            return (kP * error) + (kI * integral) + (kD * derivative);
        }
    }

    // A mock physical system standing in for real hardware: an "arm" whose
    // angle moves toward whatever the controller's output pushes it,
    // damped so it behaves a little like a real mechanism with inertia
    // instead of teleporting straight to the target.
    static class SimulatedArm {
        private double angleDegrees = 0.0;

        void applyOutput(double output) {
            // Clamp output the same way you'd clamp a real motor command --
            // a real motor can't be driven harder than "full power" either.
            double clamped = Math.max(-1.0, Math.min(1.0, output));
            angleDegrees += clamped * 3.0; // 3 degrees per tick at full output
        }

        double getAngleDegrees() {
            return angleDegrees;
        }
    }

    public static void main(String[] args) {
        double setpointDegrees = 90.0;
        double dtSeconds = 0.02; // matches the 20ms periodic loop period

        SimplePIDController pid = new SimplePIDController(0.06, 0.02, 0.006);
        SimulatedArm arm = new SimulatedArm();

        System.out.printf("Driving a simulated arm toward a %.0f degree setpoint...%n%n", setpointDegrees);

        for (int tick = 1; tick <= 150; tick++) {
            double measurement = arm.getAngleDegrees();
            double output = pid.calculate(measurement, setpointDegrees, dtSeconds);
            arm.applyOutput(output);

            if (tick % 10 == 0 || tick == 1) {
                System.out.printf(
                    "tick %3d: angle=%6.2f deg  error=%6.2f deg  output=%+.3f%n",
                    tick, measurement, setpointDegrees - measurement, output);
            }
        }

        System.out.printf("%nfinal angle: %.2f degrees (target was %.0f)%n", arm.getAngleDegrees(), setpointDegrees);
    }
}
