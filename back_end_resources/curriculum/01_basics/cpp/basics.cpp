// 01 - Basics (C++)
//
// This is a REAL, compiled C++ program -- not a notebook. That's the point.
// C++ has no interactive notebook kernel the way Python and Java do here; every
// change you make has to go through an explicit edit -> compile -> run loop:
//
//   1. EDIT this file in a text editor.
//   2. COMPILE it with a compiler (we use `make`, which just runs g++ for you
//      with the right flags -- see Makefile in this folder).
//   3. RUN the resulting binary that the compiler produced.
//
// From this directory, that loop looks like:
//
//   $ make          # compiles basics.cpp into an executable called `basics`
//   $ ./basics      # runs the executable you just built
//   $ make clean    # deletes the built executable, if you want a clean slate
//
// Unlike Python or Java in a notebook, there is no "run this one cell" -- you
// recompile the whole file and rerun the whole program every time you change
// anything. This friction is intentional to show you now: it's the same loop
// you'll use for every C++ file in this curriculum, and it's part of why C++
// feels different to work in day-to-day, especially for quick experiments.

#include <iostream>
#include <vector>

// Scoring constants. `const` in C++ means "this value cannot be reassigned
// after it's initialized" -- the compiler enforces it, same spirit as Java's
// `final`.
const int POINTS_LOW_GOAL = 2;
const int POINTS_HIGH_GOAL = 5;
const int POINTS_CLIMB = 10;

// Just like Java, every function declares its return type and each
// parameter's type explicitly. The compiler checks every call site against
// this signature before it will produce a binary at all.
int calculateScore(int lowGoalCount, int highGoalCount, bool climbed) {
    int total = lowGoalCount * POINTS_LOW_GOAL + highGoalCount * POINTS_HIGH_GOAL;
    if (climbed) {
        total += POINTS_CLIMB;
    }
    return total;
}

const double STOP_DISTANCE_INCHES = 6.0;

bool shouldStopArm(double distanceInches) {
    return distanceInches <= STOP_DISTANCE_INCHES;
}

int main() {
    // --- Variables, types, functions ---
    int lowGoalCount = 6;
    int highGoalCount = 3;
    bool climbed = true;

    int score = calculateScore(lowGoalCount, highGoalCount, climbed);
    std::cout << "Total score: " << score << std::endl;

    // --- Control flow ---
    // std::vector is C++'s resizable array type -- think of it as the C++
    // equivalent of a Java ArrayList or a Python list. We cover it properly
    // in 03_data_structures_algorithms; here we're just using it to hold a
    // simulated sequence of rangefinder readings.
    std::vector<double> readings = {24.0, 18.0, 12.0, 9.0, 6.5, 5.0, 3.0};

    for (double distance : readings) {
        if (shouldStopArm(distance)) {
            std::cout << distance << " in -> STOP" << std::endl;
        } else {
            std::cout << distance << " in -> continue" << std::endl;
        }
    }

    return 0;
}

// Try It Yourself (no solutions provided):
//
//   1. Add a fourth scoring category (e.g. a `midGoalCount` worth 3 points
//      each) to calculateScore, and pass a sample value for it from main().
//   2. Rewrite the readings loop so it also counts and prints *how many*
//      readings would have triggered a stop.
//   3. shouldStopArm currently only checks a lower bound. Write a version
//      that also flags a reading as invalid if it's negative or above some
//      maximum sensor range (e.g. 200 inches) -- real sensors do report
//      garbage values sometimes.
//
// After each change: run `make` again, then `./basics`, to see the result.
