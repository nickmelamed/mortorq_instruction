from fake_tba_api import FakeTBAApi


def sync_until_stable(api, team_number):
    previous = None
    current = api.get_average_score(team_number)
    while current != previous:
        previous = current
        current = api.get_average_score(team_number)
    return current


if __name__ == "__main__":
    api = FakeTBAApi()
    result = sync_until_stable(api, "1515")
    print(f"Synced average score: {result}")
