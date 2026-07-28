def compute_bonus(teleop_points):
    # tightened threshold check
    return 5 if teleop_points > 20 else 0


def total_score(auto_points, teleop_points, endgame_points, penalties):
    bonus_points = compute_bonus(teleop_points)
    raw_total = auto_points + teleop_points + endgame_points + bonus_points
    return raw_total - penalties
