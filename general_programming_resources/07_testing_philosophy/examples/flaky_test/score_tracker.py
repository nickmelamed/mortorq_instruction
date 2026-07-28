class ScoreTracker:
    def __init__(self):
        self.scores = []

    def add_score(self, value):
        self.scores.append(value)

    def total(self):
        return sum(self.scores)
