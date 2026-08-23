#include <iostream>
#include <map>
#include <string>

std::string* getTeamName(std::map<std::string, std::string>& teamLookup, const std::string& teamNumber) {
    auto it = teamLookup.find(teamNumber);
    if (it == teamLookup.end()) {
        return nullptr;
    }
    return &it->second;
}

std::string formatEntry(std::map<std::string, std::string>& teamLookup, const std::string& teamNumber, const std::string& notes) {
    std::string* name = getTeamName(teamLookup, teamNumber);
    return *name + ": " + notes;
}

int main() {
    std::map<std::string, std::string> teamLookup;
    teamLookup["1515"] = "Mortorq";
    teamLookup["254"] = "The Cheesy Poofs";

    std::cout << formatEntry(teamLookup, "1515", "Fast cycle times, reliable auto") << std::endl;
    std::cout << formatEntry(teamLookup, "0254", "Consistently high scoring") << std::endl;

    return 0;
}
