from scouting_entry import record_match_entry

entries = [
    record_match_entry(1515, 12, 8, 24, 10, "Fast auto, reliable climb", "Jordan"),
    record_match_entry(254, 12, 30, 6, 15, "Strong teleop, no auto", "Priya"),
]

if __name__ == "__main__":
    for entry in entries:
        print(
            f"Team {entry['team_number']}: auto={entry['auto_points']}, "
            f"teleop={entry['teleop_points']}, endgame={entry['endgame_points']} "
            f"-- \"{entry['notes']}\""
        )
