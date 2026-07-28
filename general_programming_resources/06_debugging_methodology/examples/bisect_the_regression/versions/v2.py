def compute_bonus(teleop_points):
    return 5 if teleop_points >= 20 else 0


def total_score(auto_points, teleop_points, endgame_points, penalties):
    bonus = compute_bonus(teleop_points)
    return auto_points + teleop_points + endgame_points + bonus - penalties
