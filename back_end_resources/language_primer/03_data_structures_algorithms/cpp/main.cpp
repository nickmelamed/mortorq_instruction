// 03 - Data Structures and Algorithms (C++)
//
// Build and run with:
//   $ make
//   $ ./dsa_demo

#include <iostream>
#include <queue>
#include <unordered_map>

#include "dsa.h"

int main() {
    // Stack: recent controller faults
    FaultStack faultStack;
    faultStack.push("CAN timeout: device 12");
    faultStack.push("Brownout detected");
    faultStack.push("CAN timeout: device 7");

    std::cout << "Most recent fault first:" << std::endl;
    while (!faultStack.empty()) {
        std::cout << " - " << faultStack.pop() << std::endl;
    }

    // Queue: autonomous action sequence
    // Unlike the hand-rolled FaultStack above, std::queue is a standard
    // library container: nobody hand-rolls a queue in real C++ any more
    // than they hand-roll one in Java or Python. We built FaultStack
    // ourselves specifically to practice pointers; there's no equivalent
    // pedagogical reason to reinvent std::queue.
    std::queue<std::string> actionQueue;
    actionQueue.push("drive forward");
    actionQueue.push("intake");
    actionQueue.push("shoot");
    actionQueue.push("drive back");

    std::cout << "\nExecuting in queued order:" << std::endl;
    while (!actionQueue.empty()) {
        std::cout << " - " << actionQueue.front() << std::endl;
        actionQueue.pop();
    }

    // Hashmap: CAN ID to device name 
    std::unordered_map<int, std::string> canIdToName = {
        {1, "Front Left Drive"},
        {2, "Front Right Drive"},
        {3, "Back Left Drive"},
        {4, "Back Right Drive"},
        {12, "Intake Roller"},
    };

    std::cout << "\n" << canIdToName[12] << std::endl;
    auto it = canIdToName.find(99);
    std::cout << (it != canIdToName.end() ? it->second : "<unknown device>") << std::endl;

    // Tree: same CAN ID table, but sorted 
    // Only the same handful of devices go into this tree, inserted in
    // arbitrary (not sorted) order. Deliberately NOT the 10,000-entry table
    // below: inserting keys that are already sorted into a plain BST like
    // this one builds a completely lopsided tree (every node with only a
    // right child, no left), which defeats O(log n) entirely and would
    // recurse 10,000 stack frames deep in insertNode/findNode. Keeping this
    // tree small sidesteps that; a real tree implementation would rebalance
    // itself instead (out of scope here -- see concept.md).
    DeviceTree deviceTree;
    deviceTree.insert(4, "Back Right Drive");
    deviceTree.insert(1, "Front Left Drive");
    deviceTree.insert(12, "Intake Roller");
    deviceTree.insert(2, "Front Right Drive");
    deviceTree.insert(3, "Back Left Drive");

    std::string foundName;
    std::cout << "\ntree find(12): " << (deviceTree.find(12, foundName) ? foundName : "<unknown device>") << std::endl;
    std::cout << "tree find(99): " << (deviceTree.find(99, foundName) ? foundName : "<unknown device>") << std::endl;

    std::cout << "\nAll devices, sorted by CAN ID (in-order tree walk):" << std::endl;
    deviceTree.forEachInOrder([](int id, const std::string& name) {
        std::cout << " - " << id << ": " << name << std::endl;
    });

    // Big-O in practice: linear search vs. binary search vs. hashmap
    std::vector<std::pair<int, std::string>> bigTable;
    std::unordered_map<int, std::string> bigMap;
    for (int i = 0; i < 10000; i++) {
        bigTable.emplace_back(i, "device-" + std::to_string(i));
        bigMap[i] = "device-" + std::to_string(i);
    }
    // bigTable is already sorted by id (built in order 0..9999), which is
    // exactly what binarySearchComparisons requires.

    std::cout << std::endl;
    for (int target : {5, 5000, 9999}) {
        int linearComparisons = linearSearchComparisons(bigTable, target);
        int binaryComparisons = binarySearchComparisons(bigTable, target);
        std::cout << "id=" << target << " -> linear: " << linearComparisons
                  << " comparisons, binary search: " << binaryComparisons << " comparisons" << std::endl;
    }

    std::cout << "\nhashmap lookup for id=5:    " << bigMap[5] << std::endl;
    std::cout << "hashmap lookup for id=9999: " << bigMap[9999] << std::endl;

    return 0;
}
