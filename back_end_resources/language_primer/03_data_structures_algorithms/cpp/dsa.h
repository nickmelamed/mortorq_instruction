// 03 - Data Structures and Algorithms (C++)
//
// See concept.md for the stack / queue / hashmap / Big-O background, and
// dsa.cpp for why FaultStack is built the way it is.

#ifndef DSA_H
#define DSA_H

#include <functional>
#include <string>
#include <utility>
#include <vector>

// A stack of fault messages, built by hand as a singly linked list of nodes
// connected by pointers: this is the pointer/reference material from
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

// A binary search tree keyed by CAN ID, holding a device name at each node.
// Like FaultStack, this is built by hand out of heap-allocated nodes connected
// by pointers, where every `new` in dsa.cpp's DeviceTree code is matched by
// exactly one `delete`. Search and insert both run in O(log n) time when the
// tree stays reasonably balanced. This simple version never rebalances itself,
// which matters: see the comment in main.cpp for why we only ever insert a
// handful of entries into one, instead of the same 10,000-entry table used
// for the Big-O demo.
class DeviceTree {
public:
    DeviceTree();
    ~DeviceTree();

    DeviceTree(const DeviceTree&) = delete;
    DeviceTree& operator=(const DeviceTree&) = delete;

    void insert(int canId, const std::string& name);

    // Returns true and sets outName if canId is found, false otherwise.
    bool find(int canId, std::string& outName) const;

    // Calls visit(id, name) once per entry, in ascending order by id.
    // This in-order walk is what a hashmap can't give you for free.
    void forEachInOrder(const std::function<void(int, const std::string&)>& visit) const;

private:
    struct Node {
        int canId;
        std::string name;
        Node* left;
        Node* right;
    };

    Node* root_;

    static Node* insertNode(Node* node, int canId, const std::string& name);
    static bool findNode(const Node* node, int canId, std::string& outName);
    static void forEachNode(const Node* node, const std::function<void(int, const std::string&)>& visit);
    static void deleteSubtree(Node* node);
};

// Binary searches a collection that's already sorted by id, and returns how
// many comparisons it took (mirrors linearSearchComparisons's signature and
// return convention so the two can be compared directly in main.cpp).
// Requires sortedEntries to actually be sorted by .first. Unlike a linear
// scan, binary search gives wrong answers on unsorted data, it doesn't just
// run slower.
int binarySearchComparisons(const std::vector<std::pair<int, std::string>>& sortedEntries, int targetId);

#endif  // DSA_H
