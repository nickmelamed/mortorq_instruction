// 03 - Data Structures and Algorithms (C++)
//
// See concept.md for the stack / queue / hashmap / Big-O background, and
// dsa.cpp for why FaultStack is built the way it is.

#ifndef DSA_H
#define DSA_H

#include <string>
#include <utility>
#include <vector>

// A stack of fault messages, built by hand as a singly linked list of nodes
// connected by pointers -- this is the pointer/reference material from
// 02_oop_inheritance put to real use. Unlike that topic's Motor example,
// these nodes cannot simply live as local stack variables: a stack that can
// grow and shrink at runtime needs nodes that outlive whichever function
// call pushed them, which means they have to be heap-allocated with `new`.
// We only cover heap allocation informally here, just enough to build this
// one structure correctly and safely (every `new` in dsa.cpp is matched by
// exactly one `delete`); 04a_cpp_intricacies covers the stack-vs-heap
// distinction and RAII properly, and shows a safer alternative to writing
// this by hand.
class FaultStack {
public:
    FaultStack();
    ~FaultStack();

    // Not copyable: copying would require deciding whether to deep-copy the
    // linked nodes or share them, and getting this wrong is a classic C++
    // bug. Simplest safe choice for a teaching example: disallow it outright.
    FaultStack(const FaultStack&) = delete;
    FaultStack& operator=(const FaultStack&) = delete;

    void push(const std::string& message);
    std::string pop();
    const std::string& peek() const;
    bool empty() const;
    size_t size() const;

private:
    struct Node {
        std::string message;
        Node* next;
    };

    Node* top_;
    size_t size_;
};

// Scans entries from the front looking for targetId, and returns how many
// comparisons it took (or entries.size() if targetId isn't present at all).
// Used in main.cpp to make the O(n) vs. O(1) contrast with a hashmap concrete.
int linearSearchComparisons(const std::vector<std::pair<int, std::string>>& entries, int targetId);

#endif  // DSA_H
