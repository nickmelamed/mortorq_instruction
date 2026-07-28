def get_team_name(team_lookup, team_number):
    return team_lookup[team_number]


def format_scouting_entry(team_lookup, entry):
    team_number = entry["team"]
    name = get_team_name(team_lookup, team_number)
    return f"{name}: {entry['notes']}"


def build_report(team_lookup, entries):
    lines = [format_scouting_entry(team_lookup, e) for e in entries]
    return "\n".join(lines)


if __name__ == "__main__":
    team_lookup = {
        "1515": "Mortorq",
        "254": "The Cheesy Poofs",
    }

    entries = [
        {"team": "1515", "notes": "Fast cycle times, reliable auto"},
        {"team": 254, "notes": "Consistently high scoring"},
    ]

    report = build_report(team_lookup, entries)
    print(report)
