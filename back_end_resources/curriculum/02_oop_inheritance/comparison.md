# 02 - OOP and Inheritance: Syntax Comparison

Quick reference only. See `concept.md` for the "why," and `java.ipynb` / `python.ipynb` / `cpp/Robot.h`+`cpp/Robot.cpp` for full worked examples.

| Operation | Java | Python | C++ |
|---|---|---|---|
| Define a class | `class Motor { ... }` | `class Motor:` | `class Motor { ... };` (note the semicolon) |
| Constructor | `public Motor(String name) { ... }` | `def __init__(self, name):` | `Motor(const std::string& name);` |
| Inherit from a base class | `class TalonMotor extends Motor` | `class TalonMotor(Motor):` | `class TalonMotor : public Motor` |
| Call the base class's constructor | `super(name);` | `super().__init__(name)` | `TalonMotor(...) : Motor(name) {}` |
| Override a method | `@Override` + same signature | just redefine the method | `void setPower(double p) override;` |
| Call the base class's version of an overridden method | `super.describe()` | `super().describe()` | `Motor::describe()` |
| Abstract method (no default, subclass must implement) | `abstract void setPower(double p);` | `@abstractmethod` (from `abc`) | `virtual void setPower(double p) = 0;` |
| Abstract / interface-only class | `abstract class Motor` or `interface Motor` | `class Motor(ABC):` | class with at least one pure virtual method |
| Enable dynamic dispatch (derived override runs through base type) | automatic (always dynamic) | automatic (always dynamic) | base method must be declared `virtual` |
| Access a member through a plain object | `motor.describe()` | `motor.describe()` | `motor.describe()` |
| Access a member through a pointer | N/A (no raw pointers) | N/A (no raw pointers) | `motorPtr->describe()` |
| Visible everywhere | `public` | no enforcement (just don't prefix with `_`) | `public:` |
| Visible in this class and its subclasses only | `protected` | no enforcement (convention: single `_` prefix) | `protected:` |
| Visible in this class only | `private` | no enforcement (convention: double `__` prefix triggers name-mangling) | `private:` |
