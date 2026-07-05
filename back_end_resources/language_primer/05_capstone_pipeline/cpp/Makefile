# Makefile for 05_capstone_pipeline/cpp
#
# Needs ONNX Runtime installed -- on macOS with Homebrew:
#   $ brew install onnxruntime
#
# Run `make` from this directory, then run the program it produces with
# `./infer_demo`. It loads detector.onnx from this same directory, which is
# produced by running ../python_train.ipynb (a copy is already checked in,
# so you don't have to run the notebook first just to try this).

CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra

ORT_PREFIX := $(shell brew --prefix onnxruntime)
CXXFLAGS += -I$(ORT_PREFIX)/include/onnxruntime
LDFLAGS = -L$(ORT_PREFIX)/lib -lonnxruntime -Wl,-rpath,$(ORT_PREFIX)/lib

infer_demo: infer.cpp infer.h
	$(CXX) $(CXXFLAGS) infer.cpp -o infer_demo $(LDFLAGS)

clean:
	rm -f infer_demo

.PHONY: clean
