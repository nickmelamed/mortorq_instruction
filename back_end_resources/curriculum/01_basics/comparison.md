# 01 - Basics: Syntax Comparison

Quick reference only. See `concept.md` for the "why," and `java.ipynb` / `python.ipynb` / `cpp/basics.cpp` for full worked examples.

| Operation | Java | Python | C++ |
|---|---|---|---|
| Declare an integer variable | `int count = 6;` | `count = 6` | `int count = 6;` |
| Declare a floating-point variable | `double distance = 6.5;` | `distance = 6.5` | `double distance = 6.5;` |
| Declare a boolean | `boolean climbed = true;` | `climbed = True` | `bool climbed = true;` |
| Declare a string / text | `String name = "Elevator";` | `name = "Elevator"` | `std::string name = "Elevator";` |
| Declare a constant | `final int MAX = 10;` | `MAX = 10` (convention only) | `const int MAX = 10;` |
| Define a function | `int add(int a, int b) { return a + b; }` | `def add(a, b):`<br>`    return a + b` | `int add(int a, int b) { return a + b; }` |
| Call a function | `add(2, 3)` | `add(2, 3)` | `add(2, 3)` |
| `if` / `else` | `if (x <= 6) { ... } else { ... }` | `if x <= 6:`<br>`    ...`<br>`else:`<br>`    ...` | `if (x <= 6) { ... } else { ... }` |
| Loop over a fixed range | `for (int i = 0; i < 5; i++) { ... }` | `for i in range(5):`<br>`    ...` | `for (int i = 0; i < 5; i++) { ... }` |
| Loop over a collection's values | `for (double d : readings) { ... }` | `for d in readings:`<br>`    ...` | `for (double d : readings) { ... }` |
| Print to the console | `System.out.println(x);` | `print(x)` | `std::cout << x << std::endl;` |
| Single-line comment | `// comment` | `# comment` | `// comment` |
| Entry point | any class with `public static void main(String[] args)` | top-level script code (no required entry point) | `int main() { ... }` |
