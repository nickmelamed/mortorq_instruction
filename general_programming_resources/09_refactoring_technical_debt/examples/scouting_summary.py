def format_auto_summary(entry):
    points = entry["auto_points"]
    if points < 0:
        points = 0
    if points > 30:
        rating = "excellent"
    elif points > 15:
        rating = "good"
    else:
        rating = "needs work"
    return f"Auto: {points} pts ({rating})"


def format_teleop_summary(entry):
    points = entry["teleop_points"]
    if points < 0:
        points = 0
    if points > 30:
        rating = "excellent"
    elif points >= 15:
        rating = "good"
    else:
        rating = "needs work"
    return f"Teleop: {points} pts ({rating})"


if __name__ == "__main__":
    entry = {"auto_points": 15, "teleop_points": 15}
    print(format_auto_summary(entry))
    print(format_teleop_summary(entry))
