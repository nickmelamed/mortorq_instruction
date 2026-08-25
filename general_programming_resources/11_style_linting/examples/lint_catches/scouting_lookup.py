def get_team_name(team_lookup, team_number):
    name = team_lookup.get(team_number)
    if name == None:
        return "Unknown"
    return name


def compute_average(scores):
    total = 0
    count = len(scores)
    max_score = max(scores)
    for score in scores:
        total += score
    return total / count


def format_summary(list, notes):
    return f"{len(list)} entries: {notes}"
