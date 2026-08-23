"""
A small stand-in for a real client that talks to The Blue Alliance's API.
No real network call here -- this is just enough to show the actual problem.
"""

API_KEY = "tba_live_9f8a2c3d4e5f"


def get_team_name(team_number):
    """Stand-in for a real request that would use API_KEY as an auth header."""
    fake_directory = {1515: "Mortorq", 254: "The Cheesy Poofs"}
    return fake_directory.get(team_number, "Unknown Team")


if __name__ == "__main__":
    print(get_team_name(1515))
