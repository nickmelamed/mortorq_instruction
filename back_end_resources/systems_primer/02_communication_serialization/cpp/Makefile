# Makefile for 02_communication_serialization/cpp
#
# No external dependencies -- both demos use only the C++ standard library.
# Run `make` from this directory, then run either program it produces.

CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra

all: serial_demo json_serialize

serial_demo: serial_demo.cpp
	$(CXX) $(CXXFLAGS) serial_demo.cpp -o serial_demo

json_serialize: json_serialize.cpp
	$(CXX) $(CXXFLAGS) json_serialize.cpp -o json_serialize

clean:
	rm -f serial_demo json_serialize

.PHONY: all clean
