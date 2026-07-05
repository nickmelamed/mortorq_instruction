#include "infer.h"

#include <cmath>
#include <iostream>

Detector::Detector(const std::string& modelPath)
    : env_(ORT_LOGGING_LEVEL_WARNING, "detector"),
      session_(env_, modelPath.c_str(), Ort::SessionOptions{nullptr}),
      memoryInfo_(Ort::MemoryInfo::CreateCpu(OrtArenaAllocator, OrtMemTypeDefault)) {}

std::pair<int, float> Detector::classify(const std::array<float, 4>& features) {
    // Shape {1, 4}: one detection, four features -- matches the fixed batch
    // size python_train.ipynb exported the model with.
    std::array<int64_t, 2> inputShape{1, 4};

    // const_cast is safe here: CreateTensor only needs a non-const pointer
    // because ONNX Runtime's C API is shared between reading and writing
    // tensors; it does not modify our input data.
    Ort::Value inputTensor = Ort::Value::CreateTensor<float>(
        memoryInfo_, const_cast<float*>(features.data()), features.size(), inputShape.data(), inputShape.size());

    const char* inputNames[] = {"features"};
    const char* outputNames[] = {"logits"};

    auto outputTensors = session_.Run(Ort::RunOptions{nullptr}, inputNames, &inputTensor, 1, outputNames, 1);

    float* logits = outputTensors.front().GetTensorMutableData<float>();
    // logits[0] = "not a game piece" score, logits[1] = "game piece" score.

    // Softmax over the two logits, by hand -- the model itself only outputs
    // raw scores (see python_train.ipynb: DetectorNet.forward returns them
    // straight from the last Linear layer, with no softmax applied).
    float maxLogit = std::max(logits[0], logits[1]);
    float exp0 = std::exp(logits[0] - maxLogit);
    float exp1 = std::exp(logits[1] - maxLogit);
    float sumExp = exp0 + exp1;
    float prob0 = exp0 / sumExp;
    float prob1 = exp1 / sumExp;

    if (prob1 >= prob0) {
        return {1, prob1};
    }
    return {0, prob0};
}

int main() {
    Detector detector("detector.onnx");

    // A few hand-picked feature vectors standing in for real detections a
    // vision step upstream might have produced this frame: one that looks
    // like a clean game piece, one that looks like noise, and one that's
    // genuinely ambiguous. See python_train.ipynb for how these numbers map
    // to width/height/aspect_ratio/fill_ratio.
    std::array<float, 4> clearGamePiece{0.18f, 0.18f, 1.0f, 0.78f};
    std::array<float, 4> clearNoise{0.10f, 0.22f, 1.6f, 0.30f};
    std::array<float, 4> ambiguous{0.15f, 0.19f, 1.2f, 0.55f};

    for (const auto& [name, features] : {
             std::pair{"clear game piece", clearGamePiece},
             std::pair{"clear noise", clearNoise},
             std::pair{"ambiguous", ambiguous},
         }) {
        auto [label, confidence] = detector.classify(features);
        std::cout << name << " -> label=" << label << " (\"" << (label == 1 ? "game piece" : "not a game piece")
                  << "\"), confidence=" << confidence << std::endl;
    }

    return 0;
}
