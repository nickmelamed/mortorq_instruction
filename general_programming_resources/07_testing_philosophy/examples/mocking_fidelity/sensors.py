class FaithfulSensor:
    """Simulates a real sensor landing right at the documented threshold.

    Real sensors settle near a value, not always safely past it -- 0.9 is
    the exact number should_retract_intake's docstring promises triggers
    a retract.
    """

    def read(self):
        return 0.9


class UnfaithfulSensor:
    """Always returns a clean, comfortably-above-threshold value.

    Convenient to write, but nothing about a real sensor guarantees
    readings never land exactly on a boundary.
    """

    def read(self):
        return 1.0
