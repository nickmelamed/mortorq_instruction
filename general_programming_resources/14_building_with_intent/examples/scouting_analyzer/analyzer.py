"""
Computes one number: average scouting points per match from a CSV.

Only the "average" path below is ever actually called by anything in this
file or anywhere else in this project.
"""
from abc import ABC, abstractmethod
import csv


class AnalysisStrategy(ABC):
    @abstractmethod
    def analyze(self, matches):
        ...


class AverageStrategy(AnalysisStrategy):
    def analyze(self, matches):
        points = [m["points"] for m in matches]
        return sum(points) / len(points)


class MedianStrategy(AnalysisStrategy):
    def analyze(self, matches):
        points = sorted(m["points"] for m in matches)
        mid = len(points) // 2
        if len(points) % 2 == 0:
            return (points[mid - 1] + points[mid]) / 2
        return points[mid]


class WeightedStrategy(AnalysisStrategy):
    def __init__(self, weights):
        self.weights = weights

    def analyze(self, matches):
        total_weight = sum(self.weights)
        weighted_sum = sum(m["points"] * w for m, w in zip(matches, self.weights))
        return weighted_sum / total_weight


class Config:
    """Holds settings nothing in this file currently reads."""

    def __init__(self, csv_path="scouting_data.csv", strategy_kind="average", weights=None):
        self.csv_path = csv_path
        self.strategy_kind = strategy_kind
        self.weights = weights


class AnalyzerFactory:
    @staticmethod
    def create(kind, weights=None):
        if kind == "average":
            return AverageStrategy()
        if kind == "median":
            return MedianStrategy()
        if kind == "weighted":
            return WeightedStrategy(weights)
        raise ValueError(f"unknown strategy kind: {kind}")


def main():
    matches = []
    with open("scouting_data.csv") as f:
        reader = csv.DictReader(f)
        for row in reader:
            matches.append({"points": float(row["points"])})

    strategy = AnalyzerFactory.create("average")
    result = strategy.analyze(matches)
    print(f"Average points per match: {result:.2f}")


if __name__ == "__main__":
    main()
