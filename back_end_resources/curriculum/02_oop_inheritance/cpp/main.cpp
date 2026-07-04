// 02 - OOP and Inheritance (C++)
//
// Build and run with:
//   $ make
//   $ ./robot_demo

#include <iostream>
#include "Robot.h"

// Takes a `const Motor&` -- a REFERENCE to a Motor, not a copy of one.
// Because it's a reference (not a plain `Motor`), calling describe() here
// still runs the actual object's overridden version, whatever concrete
// subclass that object really is.
void printDescription(const Motor& motor) {
    std::cout << motor.describe() << std::endl;
}

int main() {
    TalonMotor talon("Left Drive");
    SparkMotor spark("Intake Roller");

    // Motor sliced = talon;
    // ^ This line won't compile if you uncomment it: Motor is abstract (it
    // has a pure virtual setPower), so C++ won't let you declare a plain
    // Motor variable at all -- which means you can't accidentally slice a
    // TalonMotor into one either. The language is enforcing, at compile
    // time, exactly the rule from concept.md: polymorphism here can only
    // happen through a pointer or a reference to Motor, never a plain copy.

    printDescription(talon);
    printDescription(spark);

    // An array of Motor* -- pointers to Motor. Each pointer here holds the
    // address of a real, already-existing stack object above (`&talon`,
    // `&spark`); nothing is heap-allocated (no `new`, see 04a_cpp_intricacies
    // for when and why you'd reach for that instead).
    Motor* motors[] = {&talon, &spark};

    for (Motor* motor : motors) {
        motor->setPower(1.5);  // deliberately out of range for both
        // motor is a pointer, so we reach through it with `->` instead of `.`
        std::cout << motor->describe() << std::endl;
    }

    return 0;
}
