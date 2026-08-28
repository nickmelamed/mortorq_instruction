# Notebook — Week 4

**Tuesday.** Auto still missing the second game piece about half the time. Timing-based
auto (drive forward for 1.4 seconds, then turn) worked fine at practice all last week.
Not sure what's different.

**Wednesday.** Tried bumping the drive time to 1.6 seconds since it looked like the
robot was stopping a little short. Better at practice today but still inconsistent.
Someone mentioned the practice field carpet might be different from competition carpet.

**Thursday.** Talked to another team at the scrimmage, they said timing-based auto is
basically never reliable across venues because carpet friction changes how far you
actually travel for the same motor output and time. Makes sense given what we saw
Tuesday and Wednesday. Started looking at using odometry instead — track estimated
position from wheel encoders and stop based on distance traveled instead of elapsed
time.

**Thursday, later.** Got a basic odometry-based stop working. Much better at the
scrimmage than timing was. Still drifted a noticeable amount on the longer of the two
auto legs — probably wheel slip accumulating over distance, since odometry has no way
to correct for that on its own.

**Friday.** Added the gyro heading as a second check alongside the distance estimate,
and swapped the second leg specifically to stop based on a distance sensor reading
once it gets close to the second game piece, instead of trusting accumulated odometry
the whole way. Ran auto 10 times in a row on the practice bot, got the second piece 9
of 10 tries. Need to test on an actual different carpet before next event to be sure
this is really it and not just practice-field luck.
