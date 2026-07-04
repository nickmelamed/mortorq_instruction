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
    // function call -- it has to stay alive until someone pops it, which
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
