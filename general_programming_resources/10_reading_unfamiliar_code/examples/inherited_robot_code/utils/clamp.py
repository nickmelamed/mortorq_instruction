def clamp(value, low, high):
    """Clamp value into the [low, high] range."""
    return max(low, min(high, value))
