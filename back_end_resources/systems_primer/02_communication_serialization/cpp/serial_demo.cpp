// 02 - Communication & Serialization: a minimal serial write
//
// Serial is the simplest of the three channels described in concept.md: one
// device, one stream of bytes, no shared bus and no addressing scheme. A
// real coprocessor talking to a sensor over serial would open a device file
// like /dev/ttyUSB0 (Linux) using POSIX termios calls (tcgetattr/tcsetattr
// to configure the baud rate, then plain write()/read()) and send bytes
// down that connection directly.
//
// This demo doesn't open any real hardware -- there's no /dev/ttyUSB0 to
// assume exists on whatever machine builds this file -- so MockSerialPort
// below simulates a serial connection with the same open/write shape,
// printing each byte it "sends" as hex so you can see exactly what would
// have gone out over the wire.
//
// Build and run (see Makefile):
//   $ make
//   $ ./serial_demo

#include <cstdint>
#include <iomanip>
#include <iostream>
#include <string>
#include <vector>

class MockSerialPort {
public:
    explicit MockSerialPort(const std::string& device, int baudRate) : device_(device), baudRate_(baudRate) {
        std::cout << "[serial] opened " << device_ << " at " << baudRate_ << " baud (simulated)\n";
    }

    // A real implementation calls write(fd, data, length) here instead of
    // printing -- everything else about the shape (a fixed-size buffer of
    // raw bytes going out over one connection, one direction) is identical.
    void write(const std::vector<uint8_t>& bytes) {
        std::cout << "[serial] -> ";
        for (uint8_t b : bytes) {
            std::cout << "0x" << std::hex << std::setw(2) << std::setfill('0') << static_cast<int>(b) << " ";
        }
        std::cout << std::dec << "(" << bytes.size() << " bytes)\n";
    }

private:
    std::string device_;
    int baudRate_;
};

int main() {
    // A common baud rate for FRC sensors talking over serial/UART.
    MockSerialPort port("/dev/ttyUSB0", 115200);

    // A tiny, made-up sensor protocol: a start byte, a command byte meaning
    // "request distance reading," and an end byte. Real sensor protocols
    // vary; the point here is the shape -- a fixed sequence of raw bytes,
    // agreed on by both sides ahead of time -- not this exact byte layout.
    std::vector<uint8_t> requestDistance = {0xAA, 0x01, 0x55};
    port.write(requestDistance);

    std::vector<uint8_t> requestTemperature = {0xAA, 0x02, 0x55};
    port.write(requestTemperature);

    std::cout << "\nA real sensor would now write bytes back over the same connection; "
              << "this demo only shows the outbound half.\n";

    return 0;
}
