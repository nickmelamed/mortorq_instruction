import java.util.ArrayList;
import java.util.List;

public class HeadingAdjuster {
    public static void main(String[] args) {
        Drivetrain dt = new Drivetrain();
        dt.leftMotorPower = 0.8;
        dt.rightMotorPower = 0.8;

        adjustHeading(dt);
        adjustHeading(dt);
        adjustHeading(dt);

        System.out.println("Final left power: " + dt.leftMotorPower);
        System.out.println("Power history: " + dt.powerHistory);
    }

    // Tightly coupled: reaches directly into Drivetrain's public fields
    static void adjustHeading(Drivetrain dt) {
        dt.leftMotorPower = dt.leftMotorPower * 0.9;
        dt.powerHistory.add(dt.leftMotorPower);
    }
}

class Drivetrain {
    public double leftMotorPower;
    public double rightMotorPower;
    public List<Double> powerHistory = new ArrayList<>();
}
