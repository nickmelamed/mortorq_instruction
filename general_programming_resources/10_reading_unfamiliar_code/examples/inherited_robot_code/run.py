from autonomous.sequencer import AutoSequencer


def run_autonomous():
    seq = AutoSequencer()
    done = False
    while not done:
        done = seq.tick()
    for line in seq.log:
        print(line)


if __name__ == "__main__":
    run_autonomous()
