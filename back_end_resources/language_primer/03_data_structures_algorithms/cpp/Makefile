# Makefile for 03_data_structures_algorithms/cpp
#
# Run `make` from this directory, then run the program it produces with
# `./dsa_demo`.

CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra

dsa_demo: main.cpp dsa.cpp dsa.h
	$(CXX) $(CXXFLAGS) main.cpp dsa.cpp -o dsa_demo

clean:
	rm -f dsa_demo

.PHONY: clean
