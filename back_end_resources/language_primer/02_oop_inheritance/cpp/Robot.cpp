#include "Robot.h"

#include <algorithm>
#include <sstream>
#include <iomanip>

Motor::Motor(const std::string& name) : name_(name), currentPower_(0.0) {}

std::string Motor::describe() const {
    std::ostringstream out;
    out << name_ << ": " << std::fixed << std::setprecision(2) << currentPower_ << " power";
    return out.str();
}

TalonMotor::TalonMotor(const std::string& name) : Motor(name) {}

void TalonMotor::setPower(double power) {
    currentPower_ = std::max(-kMaxPower, std::min(kMaxPower, power));
}

std::string TalonMotor::describe() const {
    return "[Talon] " + Motor::describe();
}

SparkMotor::SparkMotor(const std::string& name) : Motor(name) {}

void SparkMotor::setPower(double power) {
    currentPower_ = std::max(-kMaxPower, std::min(kMaxPower, power));
}

std::string SparkMotor::describe() const {
    return "[Spark] " + Motor::describe();
}
