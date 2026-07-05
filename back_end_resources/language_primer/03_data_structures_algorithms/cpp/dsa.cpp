#include "dsa.h"

#include <stdexcept>

FaultStack::FaultStack() : top_(nullptr), size_(0) {}

FaultStack::~FaultStack() {
    // Every node was allocated with `new` in push(); walk the list and free
    // each one so the whole stack cleans up after itself when it goes out
    // of scope, instead of leaking memory.
    Node* current = top_;
    while (current != nullptr) {
        Node* next = current->next;
        delete current;
        current = next;
    }
}

void FaultStack::push(const std::string& message) {
    // A new node is heap-allocated here because it needs to outlive this
    // function call. It has to stay alive until someone pops it, which
    // could be arbitrarily far in the future.
    Node* node = new Node{message, top_};
    top_ = node;
    size_++;
}

std::string FaultStack::pop() {
    if (top_ == nullptr) {
        throw std::runtime_error("pop() called on an empty FaultStack");
    }
    Node* old_top = top_;
    std::string message = old_top->message;
    top_ = old_top->next;
    delete old_top;
    size_--;
    return message;
}

const std::string& FaultStack::peek() const {
    if (top_ == nullptr) {
        throw std::runtime_error("peek() called on an empty FaultStack");
    }
    return top_->message;
}

bool FaultStack::empty() const {
    return top_ == nullptr;
}

size_t FaultStack::size() const {
    return size_;
}

int linearSearchComparisons(const std::vector<std::pair<int, std::string>>& entries, int targetId) {
    int comparisons = 0;
    for (const auto& entry : entries) {
        comparisons++;
        if (entry.first == targetId) {
            return comparisons;
        }
    }
    return comparisons;
}

DeviceTree::DeviceTree() : root_(nullptr) {}

DeviceTree::~DeviceTree() {
    deleteSubtree(root_);
}

void DeviceTree::deleteSubtree(Node* node) {
    if (node == nullptr) {
        return;
    }
    deleteSubtree(node->left);
    deleteSubtree(node->right);
    delete node;
}

void DeviceTree::insert(int canId, const std::string& name) {
    root_ = insertNode(root_, canId, name);
}

DeviceTree::Node* DeviceTree::insertNode(Node* node, int canId, const std::string& name) {
    if (node == nullptr) {
        return new Node{canId, name, nullptr, nullptr};
    }
    if (canId < node->canId) {
        node->left = insertNode(node->left, canId, name);
    } else if (canId > node->canId) {
        node->right = insertNode(node->right, canId, name);
    } else {
        node->name = name;  // Same ID seen again. Update rather than duplicate.
    }
    return node;
}

bool DeviceTree::find(int canId, std::string& outName) const {
    return findNode(root_, canId, outName);
}

bool DeviceTree::findNode(const Node* node, int canId, std::string& outName) {
    if (node == nullptr) {
        return false;
    }
    if (canId == node->canId) {
        outName = node->name;
        return true;
    }
    return canId < node->canId ? findNode(node->left, canId, outName)
                                : findNode(node->right, canId, outName);
}

void DeviceTree::forEachInOrder(const std::function<void(int, const std::string&)>& visit) const {
    forEachNode(root_, visit);
}

void DeviceTree::forEachNode(const Node* node, const std::function<void(int, const std::string&)>& visit) {
    if (node == nullptr) {
        return;
    }
    forEachNode(node->left, visit);
    visit(node->canId, node->name);
    forEachNode(node->right, visit);
}

int binarySearchComparisons(const std::vector<std::pair<int, std::string>>& sortedEntries, int targetId) {
    int comparisons = 0;
    int low = 0;
    int high = static_cast<int>(sortedEntries.size()) - 1;
    while (low <= high) {
        comparisons++;
        int mid = low + (high - low) / 2;
        if (sortedEntries[mid].first == targetId) {
            return comparisons;
        } else if (sortedEntries[mid].first < targetId) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return comparisons;
}
