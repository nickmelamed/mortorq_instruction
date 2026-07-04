# Makefile for 02_oop_inheritance/cpp
#
# Run `make` from this directory, then run the program it produces with
# `./robot_demo`.

CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra

robot_demo: main.cpp Robot.cpp Robot.h
	$(CXX) $(CXXFLAGS) main.cpp Robot.cpp -o robot_demo

clean:
	rm -f robot_demo

.PHONY: clean
