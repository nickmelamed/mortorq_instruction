# Makefile for 04a_cpp_intricacies/cpp
#
# Run `make` from this directory to build both demos, then run each one
# with `./memory_demo` and `./smart_pointers_demo`.

CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra

all: memory_demo smart_pointers_demo

memory_demo: memory_demo.cpp
	$(CXX) $(CXXFLAGS) memory_demo.cpp -o memory_demo

smart_pointers_demo: smart_pointers_demo.cpp
	$(CXX) $(CXXFLAGS) smart_pointers_demo.cpp -o smart_pointers_demo

clean:
	rm -f memory_demo smart_pointers_demo

.PHONY: all clean
