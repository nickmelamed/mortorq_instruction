// 02 - OOP and Inheritance (C++)
//
// Declares the same Motor / TalonMotor / SparkMotor hierarchy built in
// java.ipynb and python.ipynb. See concept.md for the "just enough pointers
// and references" background before reading this file.

#ifndef ROBOT_H
#define ROBOT_H

#include <string>

// Motor is an abstract base class: setPower is a *pure* virtual method
// (the "= 0" at the end), meaning Motor declares that every motor must have
// a setPower method, but provides no implementation itself. A class with any
// pure virtual method cannot be instantiated directly. `Motor m("x");`
// will not compile. Only concrete subclasses that implement setPower can be
// constructed.
class Motor {
public:
    // `explicit` blocks implicit conversions: without it, C++ would let a bare
    // string silently convert into a Motor anywhere one was expected (e.g.
    // passing "test" to a function that wants a Motor). Marking a single-argument
    // constructor `explicit` forces callers to construct one on purpose,
    // `Motor(name)`, instead of it happening as an invisible side effect.
    explicit Motor(const std::string& name);

    // A base class destructor should be `virtual` whenever the class is
    // meant to be used polymorphically through pointers, so that deleting a
    // derived object through a base pointer runs the derived destructor too.
    // We never heap-allocate a Motor in this topic (see 04a_cpp_intricacies
    // for `new`/`delete`), so it isn't load-bearing here yet, but it's the
    // correct habit to build now, before it matters.
    virtual ~Motor() = default;

    // Pure virtual: no body, and no default for subclasses to inherit.
    // Every subclass MUST override this.
    virtual void setPower(double power) = 0;

    // Virtual, but NOT pure: this has a real, usable default implementation.
    // Subclasses may override it (both of ours do) or just inherit it as-is.
    virtual std::string describe() const;

// protected, not private: TalonMotor and SparkMotor need direct access to
// currentPower_ to implement their own setPower, but code outside the Motor
// hierarchy should go through setPower/describe instead of reaching in
// directly. See concept.md's "Encapsulation and access modifiers" section.
protected:
    std::string name_;
    double currentPower_;
};

class TalonMotor : public Motor {
public:
    static constexpr double kMaxPower = 1.0;

    explicit TalonMotor(const std::string& name);  // explicit for the same reason as Motor's constructor above

    void setPower(double power) override;
    std::string describe() const override;
};

class SparkMotor : public Motor {
public:
    // This particular Spark is geared for a mechanism with a lower safe limit.
    static constexpr double kMaxPower = 0.8;

    explicit SparkMotor(const std::string& name);  // explicit for the same reason as Motor's constructor above

    void setPower(double power) override;
    std::string describe() const override;
};

#endif  // ROBOT_H
