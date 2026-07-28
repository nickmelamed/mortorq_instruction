def is_valid_score(points):
    if not isinstance(points, int):
        return False
    if points < 0:
        return False
    if points > 100:
        return False
    return True


def format_score(points):
    if is_valid_score(points):
        return f"Score: {points}"
    return "Invalid score"
