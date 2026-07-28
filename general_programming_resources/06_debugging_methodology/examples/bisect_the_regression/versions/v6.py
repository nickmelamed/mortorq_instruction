def compute_bonus(teleop_points: float) -> float:
    """Return the teleop bonus: +5 points once teleop_points clears the threshold."""
    return 5 if teleop_points > 20 else 0


def total_score(auto_points: float, teleop_points: float, endgame_points: float, penalties: float) -> float:
    """Compute a match's total score, including any bonuses, minus penalties."""
    components = [auto_points, teleop_points, endgame_points, compute_bonus(teleop_points)]
    return sum(components) - penalties
