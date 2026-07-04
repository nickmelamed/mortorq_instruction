// 04a - C++ Intricacies: Raw Pointer Pitfalls vs. Smart Pointers
//
// Build and run with:
//   $ make
//   $ ./smart_pointers_demo

#include <iostream>
#include <memory>
#include <stdexcept>
#include <string>

struct Resource {
    std::string label;

    explicit Resource(std::string label) : label(std::move(label)) {
        std::cout << "acquired: " << this->label << std::endl;
    }

    ~Resource() {
        std::cout << "released: " << label << std::endl;
    }

    void mightFail(bool shouldFail) {
        if (shouldFail) {
            throw std::runtime_error("something went wrong");
        }
        std::cout << label << " did its work" << std::endl;
    }
};

// PITFALL: this function has a real bug. If mightFail() throws, the
// exception unwinds straight past `delete resource;` at the bottom -- it is
// simply never reached -- and the Resource leaks. This is one of the most
// common raw-pointer mistakes in real C++ code: any early return, any
// exception, any `continue`/`break` added later between the `new` and the
// `delete` can silently reopen this exact bug.
void withRawPointerBuggy(bool shouldFail) {
    Resource* resource = new Resource("buggy-raw-pointer");
    resource->mightFail(shouldFail);  // if this throws, the delete below never runs
    delete resource;
}

// FIXED, but fragile: correct now, because we added a catch block whose
// only job is to delete resource before rethrowing. Every new exit path
// added to this function in the future has to remember to do the same
// thing, by hand, forever, or the bug comes right back.
void withRawPointerFixed(bool shouldFail) {
    Resource* resource = new Resource("fixed-raw-pointer");
    try {
        resource->mightFail(shouldFail);
    } catch (...) {
        std::cout << "caught an exception; manually deleting before rethrow" << std::endl;
        delete resource;
        throw;
    }
    delete resource;
}

// unique_ptr: correct AND not fragile. Its destructor runs automatically no
// matter how this function exits -- normal return, early return, or an
// exception unwinding straight through it -- so there is no delete to
// forget, anywhere, ever.
void withUniquePtr(bool shouldFail) {
    std::unique_ptr<Resource> resource = std::make_unique<Resource>("unique-ptr-resource");
    resource->mightFail(shouldFail);
}

int main() {
    std::cout << "--- Buggy raw pointer, no failure (looks fine!) ---" << std::endl;
    withRawPointerBuggy(false);

    std::cout << "\n--- Buggy raw pointer, WITH failure (this leaks) ---" << std::endl;
    try {
        withRawPointerBuggy(true);
    } catch (const std::exception& e) {
        std::cout << "caught: " << e.what() << std::endl;
    }
    std::cout << "notice there is no \"released: buggy-raw-pointer\" line above -- that's the leak" << std::endl;

    std::cout << "\n--- Fixed raw pointer, WITH failure ---" << std::endl;
    try {
        withRawPointerFixed(true);
    } catch (const std::exception& e) {
        std::cout << "caught: " << e.what() << std::endl;
    }

    std::cout << "\n--- unique_ptr, WITH failure ---" << std::endl;
    try {
        withUniquePtr(true);
    } catch (const std::exception& e) {
        std::cout << "caught: " << e.what() << std::endl;
    }
    std::cout << "released ran automatically above, during stack unwinding -- no delete anywhere in withUniquePtr" << std::endl;

    std::cout << "\n--- shared_ptr: shared ownership ---" << std::endl;
    std::shared_ptr<Resource> shared1 = std::make_shared<Resource>("shared-resource");
    std::cout << "use_count after first shared_ptr: " << shared1.use_count() << std::endl;
    {
        std::shared_ptr<Resource> shared2 = shared1;  // shares ownership, does not copy the Resource
        std::cout << "use_count after copying into a second shared_ptr: " << shared1.use_count() << std::endl;
    }  // shared2 destroyed here, but the Resource is NOT released yet -- shared1 still owns it
    std::cout << "use_count after shared2 went out of scope: " << shared1.use_count() << std::endl;
    std::cout << "shared-resource is released below, once shared1 itself goes out of scope" << std::endl;

    return 0;
}

// Try It Yourself (no solutions provided):
//
//   1. Fix withRawPointerBuggy the way withRawPointerFixed was fixed, and
//      confirm the leak (missing "released:" line) goes away.
//   2. Change withUniquePtr to take an existing std::unique_ptr<Resource> as
//      a parameter instead of constructing its own, and figure out why you
//      have to pass it with std::move(...) at the call site (hint: it's the
//      same "can't be copied, only moved" rule from concept.md).
//   3. Add a second std::shared_ptr<Resource> to a DIFFERENT Resource, and
//      print both objects' use_count() side by side to confirm they're
//      tracked independently.
