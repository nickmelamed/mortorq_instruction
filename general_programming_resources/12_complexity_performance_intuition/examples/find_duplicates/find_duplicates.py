def make_entries(n, inject_duplicate=False):
    """n unique entries, 0..n-1. If inject_duplicate, the last entry repeats the first."""
    entries = list(range(n))
    if inject_duplicate and n > 1:
        entries[-1] = entries[0]
    return entries


def naive_find_duplicate(entries):
    """Check every pair of entries directly against each other."""
    for i in range(len(entries)):
        for j in range(len(entries)):
            if i != j and entries[i] == entries[j]:
                return entries[i]
    return None


def fast_find_duplicate(entries):
    """Remember every entry we've already seen; check membership, don't re-scan."""
    seen = set()
    for entry in entries:
        if entry in seen:
            return entry
        seen.add(entry)
    return None


def hidden_quadratic_find_duplicate(entries):
    """Only one `for` loop -- looks exactly like fast_find_duplicate's shape.

    `seen` is a list here instead of a set, and `in` on a list is a linear
    scan. Checking a growing list once per entry is secretly the same
    n-times-n shape as naive_find_duplicate, just with the second loop
    hidden inside `in` instead of written out as a second `for`.
    """
    seen = []
    for entry in entries:
        if entry in seen:
            return entry
        seen.append(entry)
    return None
