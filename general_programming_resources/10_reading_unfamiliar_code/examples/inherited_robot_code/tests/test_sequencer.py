from autonomous.sequencer import AutoSequencer


def test_sequence_completes_in_four_ticks():
    seq = AutoSequencer()
    done = False
    ticks = 0
    while not done:
        done = seq.tick()
        ticks += 1
    assert ticks == 4


def test_sequence_ends_with_arm_at_rest():
    seq = AutoSequencer()
    done = False
    while not done:
        done = seq.tick()
    assert seq.arm.angle == seq.arm.REST_ANGLE_DEGREES
