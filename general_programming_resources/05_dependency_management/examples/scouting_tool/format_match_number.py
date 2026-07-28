from zero_pad import pad


def format_match_number(match_number):
    """Format a match number as a zero-padded 3-digit string, e.g. 7 -> '007'."""
    return pad(match_number, 3)
