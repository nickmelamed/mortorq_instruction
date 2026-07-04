# Makefile for 01_basics/cpp
#
# `make` on its own reads this file and runs whatever the first target (below,
# that's `basics`) needs to be built. Run `make` from this directory, then
# run the program it produces with `./basics`.

CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra

basics: basics.cpp
	$(CXX) $(CXXFLAGS) basics.cpp -o basics

clean:
	rm -f basics

.PHONY: clean
