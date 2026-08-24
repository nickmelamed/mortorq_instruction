def clamp_score(score):
    return max(0, min(100, score))


def bonus_for_speed(cycle_time_seconds):
    return 10 if cycle_time_seconds < 5 else 0


def total_match_score(base_score, cycle_time_seconds):
    return clamp_score(base_score) + bonus_for_speed(cycle_time_seconds)
