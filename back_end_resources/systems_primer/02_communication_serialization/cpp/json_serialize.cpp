// 02 - Communication & Serialization: serializing a struct to JSON
//
// This is the exact shape of data that would need to cross from a C++
// coprocessor to Java robot code in a real vision pipeline (see
// concept.md and the languages primer's 05_capstone_pipeline): a detection
// result with a class label, a confidence score, and an x/y position.
//
// A real project would reach for an existing library (nlohmann/json is the
// standard choice in C++) rather than building a JSON writer by hand. This
// file writes JSON manually instead, on purpose: with no external
// dependency beyond the standard library, it stays simple enough to read
// top to bottom and see exactly what "serialization" is actually doing --
// turning a structured, in-memory object into a plain text string that any
// other language can parse, with no shared struct definition required on
// the receiving end.
//
// Build and run (see Makefile):
//   $ make
//   $ ./json_serialize

#include <iostream>
#include <sstream>
#include <string>

// The struct being serialized -- this mirrors DetectionResult from the
// languages primer's OrchestratorExample.java, plus an x/y position that
// example didn't need but a real targeting system would.
struct DetectionResult {
    int label;
    double confidence;
    double x;
    double y;
};

// Converts one DetectionResult into a JSON object, as a string. On the
// receiving side (Java, in a real system), this string would arrive over a
// socket or a NetworkTables string entry, and get parsed back into
// something structured -- a Map, a record, whatever that side finds
// convenient -- without ever needing this exact C++ struct definition.
std::string toJson(const DetectionResult& result) {
    std::ostringstream out;
    out << "{"
        << "\"label\":" << result.label << ","
        << "\"confidence\":" << result.confidence << ","
        << "\"x\":" << result.x << ","
        << "\"y\":" << result.y
        << "}";
    return out.str();
}

int main() {
    DetectionResult gamePieceDetection{1, 0.97, 0.42, 0.61};
    DetectionResult noiseDetection{0, 0.89, 0.10, 0.15};

    std::cout << "Serialized detection results, ready to send over the wire:\n\n";
    std::cout << toJson(gamePieceDetection) << "\n";
    std::cout << toJson(noiseDetection) << "\n";

    std::cout << "\nEach line above is a complete, self-describing message: a Java program "
              << "reading it needs no shared struct definition, no matching field order, just "
              << "an agreement that these four keys exist and mean what their names say.\n";

    return 0;
}
