import java.util.Random;

public class Auto {
    // Seeded on purpose so behavior is reproducible before/after refactoring
    // (you'll see why that matters in 08_reproducibility).
    static Random rng = new Random(42);

    public static void doStuff() {
        double x = readSensor();
        double y;
        boolean flag2 = false;

        if (x > 10) {
            y = x * 0.5;
            flag2 = true;
        } else {
            y = x * 2;
        }

        System.out.println("[LOG] sensor=" + x + " output=" + y);

        driveMotor(y);

        if (flag2) {
            System.out.println("[LOG] entering hold mode");
        }
    }

    static double readSensor() {
        return rng.nextDouble() * 20;
    }

    static void driveMotor(double power) {
        System.out.println("Driving motor at power " + power);
    }

    public static void main(String[] args) {
        for (int i = 0; i < 3; i++) {
            doStuff();
        }
    }
}
