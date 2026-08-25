class FakeTBAApi:
    """A small, deterministic stand-in for a live match-data API.

    No real network involved. Two things it does on purpose, to mirror what
    a real API pulled from a venue with unreliable wifi actually does:

    1. Its 4th call always raises ConnectionError, simulating one dropped
       request mid-event -- not a rare edge case.
    2. Every successful call returns a value that creeps closer to a true
       average but never lands on it exactly, simulating a live scouting
       average that's still trickling in new data.
    """

    def __init__(self):
        self._call_count = 0

    def get_average_score(self, team_number):
        self._call_count += 1
        if self._call_count == 4:
            raise ConnectionError("TBA request timed out (venue wifi)")

        true_value = 47 + 1 / 3
        step = 1 / (2 ** self._call_count)
        return true_value - step
