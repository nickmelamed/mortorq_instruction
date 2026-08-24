from datetime import datetime, timedelta, timezone

# In a real scouting app this would come from the event schedule --
# "the next match starts in 8 hours." Written down as a naive datetime,
# with no record of which timezone it was computed in.
MATCH_TIME = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(hours=8)


def match_status():
    now = datetime.now()
    if now < MATCH_TIME:
        return "upcoming"
    return "completed"


if __name__ == "__main__":
    print(f"System local time right now: {datetime.now()}")
    print(f"Match status: {match_status()}")
