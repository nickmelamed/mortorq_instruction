# 14 - Building With Intent

## One Key Question

Everything in this module is handling the same question: **know what you're building, and for whom, before building**. Skip this, and its how you end up wondering what went wrong during competition after weeks of building "working" code. 

## Build for the Purpose in Front of You

**YAGNI** ("You Aren't Gonna Need It") is the discipline of building only what the problem in front of you actually requires, instead of a general system for problems you're imagining you might have later. It's the exact mirror image of `09_refactoring_technical_debt`: debt is too little structure, taken on now, that costs you later; this is too much structure, built now, for a "later" that frequently never arrives.

```python
# Built for one hardcoded analysis, "in case we need other kinds later"
class AnalysisStrategy(ABC):
    @abstractmethod
    def analyze(self, matches): ...

class AverageStrategy(AnalysisStrategy):
    def analyze(self, matches):
        return sum(m["points"] for m in matches) / len(matches)

class AnalyzerFactory:
    @staticmethod
    def create(kind):
        if kind == "average":
            return AverageStrategy()
        raise ValueError(f"unknown kind: {kind}")

result = AnalyzerFactory.create("average").analyze(matches)
```

```python
# Built for the one thing actually needed right now
def average_points(matches):
    return sum(m["points"] for m in matches) / len(matches)

result = average_points(matches)
```

Both compute the same number. The first version costs real time to write, read, and maintain, and buys nothing until the different analysis actually shows up. A reasonable rule of thumb: generalize once you have two or more callers that need the variation. The moment a second real need shows up, that's exactly when `09`'s refactoring discipline earns its keep, turning the direct version into something more general, only when the need actually exists. 

## Define Goal Metric

A **goal metric** is a checkable statement of what "done" means, decided *before* you start building. "Make auto better" isn't checkable by anyone. "Autonomous scores at least 2 game pieces in at least 9 of the last 10 runs" is; once you do the 10 runs, you'll know if the autos worked to the standard you set. 

Watch for **vanity metrics**: a number that's easy to move but doesn't reflect the goal. "Autonomous ran without crashing 10 times in a row" is a real, measurable number, that has importance, but it never really answers the question if our auto is good. Its a nice baseline, but if we want to score points, this isn't really helping us.

 A goal metric is only doing its job if moving it actually means the thing you set out to build is actually working, not just running.

## Designing with End Users in Mind

"Design for the end user" usually gets taught as a screen-and-form idea; `front_end_resources/product_design_primer` covers exactly that version in depth. If what you're building has a screen, go read that primer; this section is the same discipline generalized to code that never renders anything.

Most code in this curriculum still has a real end user, even without a screen in sight. Think of our drivers in a match, with no time to deal with vague button correspondence, or a scout with about 30 seconds between matches to enter data before the next one starts, or a tired judge skimming our code after looking at 15 other robots. Each of those has different, real constraints on what you build, and they're the actual people this code has to work for. 

There's one more end user worth naming explicitly, and its easy to forget: your teammates, and future you! A clearly named function, a sane file layout, a comment that explains a real "why" are, in this light, designing for an end user too. This is the same codebase-fluency throughline that `01`, `03`, `09`, and `10` already share.

## Matching Quality to Code

A one-off script you run once on your own laptop to check a number can crash, and you just fix it and rerun it. No need to spend time writing a comprehensive test suite. Subsytems are another level: they have to survive bad input, a dropped connection, or a value nobody expected, because there's no "just rerun it" option mid-match.

The same distinction shows up in two more places this curriculum touches only lightly: a script that dies silently doesn't need a trail, but code running unattended during a match should leave one (`back_end_resources/systems_primer/07_logging_observability`), and a hardcoded constant is perfectly fine in a scratch script but not in code that has to behave identically on a practice bot and a competition bot (`back_end_resources/systems_primer/09_configuration_constants_management`).

Now, we have to be careful: code that started as "just a quick script" quietly becomes the thing everyone actually depends on, while still being held to the bar it was written under. You need to match the quality needed to the code before you go ahead and start letting this happen. 

## Putting it together

Open `examples/scouting_analyzer/`. There's a small script that computes one number (average scouting points per match) but is built as a four-class strategy-and-factory hierarchy nobody ever calls more than one path of, while having zero handling for the missing-file and malformed-row problems that actually happen every time a scout reruns it at a real event. Work through `exercises/exercise-1-right-size-the-analyzer.md` to fix both problems at once, then `exercises/exercise-2-define-done-before-you-build.md` to practice defining a goal metric and naming real end users before writing any code at all.

## See also

- **`09_refactoring_technical_debt`** — the mirror-image failure mode: that module is under-building (debt); this one is over-building (speculative generality), the same discipline of matching effort to actual need, from the opposite direction.
- **`13_designing_under_constraints`** — this module's production-vs-local section is where "assume external input can fail" becomes a question of *which* code needs that treatment at all, not just how to write the check.
- **`15_technical_communication`** — a goal metric, defined before you start, is the checkable answer to the "why" that module's problem → constraint → decision → why shape asks a judge to evaluate.
- **`07_testing_philosophy`** — the same "is this worth the effort, given what it actually needs to survive" judgment call, generalized here from testing specifically to engineering effort as a whole.
- **`front_end_resources/product_design_primer`** — the deep, screen-and-form version of this module's end-user section; read that primer directly if the "end user" in question is a literal UI.
- **`19_postmortems_and_incident_review`** — production code breaking in front of real users, judges, or drivers with no record of why is exactly what triggers a postmortem; matching the bar in the first place is how you avoid needing one.

## Resources

- [Martin Fowler: Yagni](https://martinfowler.com/bliki/Yagni.html) - Fowler's own explanation of "You Aren't Gonna Need It," the principle this module's first section is built on, including the real costs of building for an imagined future need.
- [Eric Ries: Vanity Metrics vs. Actionable Metrics](https://tim.blog/2009/05/19/vanity-metrics-vs-actionable-metrics/) - a guest post by Eric Ries distinguishing metrics that actually inform a real decision from ones that just look good, the same distinction this module's goal-metrics section warns about in miniature.
