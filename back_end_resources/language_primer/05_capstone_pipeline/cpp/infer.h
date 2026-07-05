// 05 - Capstone: C++ Inference
//
// Loads the model exported by ../python_train.ipynb (cpp/detector.onnx) and
// runs it. See concept.md for how this fits into the larger pipeline.

#ifndef INFER_H
#define INFER_H

#include <array>
#include <string>
#include <utility>

#include <onnxruntime_cxx_api.h>

// Wraps an ONNX Runtime session for the game-piece-vs-noise detector trained
// in python_train.ipynb. One Detector loads the model once; classify() can
// then be called repeatedly, once per candidate blob per camera frame,
// without reloading anything -- exactly how this would run for real on a
// coprocessor for the length of a match.
class Detector {
public:
    explicit Detector(const std::string& modelPath);

    // features = {width, height, aspect_ratio, fill_ratio}, matching the
    // feature vector defined in python_train.ipynb. Returns
    // {predicted_label, confidence}: label 1 means "game piece", 0 means
    // "not a game piece"; confidence is the model's softmax probability for
    // whichever label it picked.
    std::pair<int, float> classify(const std::array<float, 4>& features);

private:
    Ort::Env env_;
    Ort::Session session_;
    Ort::MemoryInfo memoryInfo_;
};

#endif  // INFER_H
