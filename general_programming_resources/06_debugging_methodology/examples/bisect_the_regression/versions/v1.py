def total_score(auto_points, teleop_points, endgame_points, penalties):
    bonus = 5 if teleop_points >= 20 else 0
    return auto_points + teleop_points + endgame_points + bonus - penalties
