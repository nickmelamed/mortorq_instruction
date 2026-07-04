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
    // --- Stack: recent controller faults ---
    FaultStack faultStack;
    faultStack.push("CAN timeout: device 12");
    faultStack.push("Brownout detected");
    faultStack.push("CAN timeout: device 7");

    std::cout << "Most recent fault first:" << std::endl;
    while (!faultStack.empty()) {
        std::cout << " - " << faultStack.pop() << std::endl;
    }

    // --- Queue: autonomous action sequence ---
    // Unlike the hand-rolled FaultStack above, std::queue is a standard
    // library container -- nobody hand-rolls a queue in real C++ any more
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

    // --- Hashmap: CAN ID to device name ---
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

    // --- Big-O in practice: linear search vs. hashmap lookup ---
    std::vector<std::pair<int, std::string>> bigTable;
    std::unordered_map<int, std::string> bigMap;
    for (int i = 0; i < 10000; i++) {
        bigTable.emplace_back(i, "device-" + std::to_string(i));
        bigMap[i] = "device-" + std::to_string(i);
    }

    std::cout << std::endl;
    for (int target : {5, 5000, 9999}) {
        int comparisons = linearSearchComparisons(bigTable, target);
        std::cout << "linear search for id=" << target << ": " << comparisons << " comparisons" << std::endl;
    }

    std::cout << "\nhashmap lookup for id=5:    " << bigMap[5] << std::endl;
    std::cout << "hashmap lookup for id=9999: " << bigMap[9999] << std::endl;

    return 0;
}
