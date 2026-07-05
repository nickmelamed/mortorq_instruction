// 04a - C++ Intricacies: Stack vs. Heap
//
// Build and run with:
//   $ make
//   $ ./memory_demo
//
// Tracker exists purely to make construction/destruction visible: every
// time one is created or destroyed, it prints a line, so you can watch
// exactly when cleanup does (and doesn't) happen.

#include <iostream>
#include <string>

struct Tracker {
    std::string label;

    explicit Tracker(std::string label) : label(std::move(label)) {
        std::cout << "constructed: " << this->label << std::endl;
    }

    ~Tracker() {
        std::cout << "destroyed:   " << label << std::endl;
    }
};

// Returns a pointer to a LOCAL (stack) variable, whic hisundefined behavior.
// Left here commented out on purpose, so you can see what NOT to do: the
// instant makeDangling() returns, `local`'s stack memory is freed and may
// be reused by the very next function call. The pointer this returns no
// longer points to anything valid, so dereferencing it is a bug that might
// "work" by pure luck, or might crash, or might silently corrupt unrelated
// data, unpredictably. We are not calling this function.
//
// int* makeDangling() {
//     int local = 42;
//     return &local;
// }

int main() {
    std::cout << "--- Stack allocation ---" << std::endl;
    {
        Tracker stackTracker("stack-object");
        std::cout << "stackTracker is alive here, inside its block" << std::endl;
    }  // <- stackTracker's destructor runs automatically, right here, at this brace
    std::cout << "stackTracker is gone now that its block has ended" << std::endl;

    std::cout << "\n--- Heap allocation ---" << std::endl;
    Tracker* heapTracker = new Tracker("heap-object");
    std::cout << "heapTracker is alive here..." << std::endl;
    std::cout << "...and still alive here, well past where stackTracker already died" << std::endl;
    delete heapTracker;  // nothing does this for us automatically -- we have to say so

    std::cout << "\n--- What happens if you forget to delete ---" << std::endl;
    Tracker* leaked = new Tracker("leaked-object");
    (void)leaked;  // suppress an "unused variable" warning; we're leaking this on purpose
    std::cout << "leaked-object's destructor will NEVER run in this program -- we never call delete on it." << std::endl;
    std::cout << "count the \"constructed:\" lines above against the \"destroyed:\" lines -- there's one missing." << std::endl;

    return 0;
}

// Try It Yourself (no solutions provided):
//
//   1. Add a `delete leaked;` line at the end of main() and rerun. Confirm
//      a matching "destroyed: leaked-object" line now appears.
//   2. Wrap a Tracker in a loop that creates and lets ten of them go out of
//      scope on the stack. Count the constructed/destroyed lines -- do they
//      come in the order you expect?
//   3. (Optional, if you have `valgrind` or macOS's `leaks` tool available)
//      Build with `make`, then run the leak checker against ./memory_demo
//      before adding the fix from exercise 1, and again after, and compare.
