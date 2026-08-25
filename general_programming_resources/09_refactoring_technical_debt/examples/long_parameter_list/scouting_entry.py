def record_match_entry(team_number, match_number, auto_points, teleop_points, endgame_points, notes, scout_name):
    return {
        "team_number": team_number,
        "match_number": match_number,
        "auto_points": auto_points,
        "teleop_points": teleop_points,
        "endgame_points": endgame_points,
        "notes": notes,
        "scout_name": scout_name,
    }
