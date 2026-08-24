def should_retract_intake(sensor):
    """Retract the intake once the game piece sensor reads 0.9 or higher."""
    reading = sensor.read()
    return reading > 0.9
