// TeamCoverageChart.tsx -- how many times has each team actually been
// scouted? A bar's length is the oldest trick in visualization for a
// reason: turning a column of numbers into a column of lengths lets you
// compare them at a glance instead of reading and comparing digits. No
// charting library here -- see this topic's concept.md for why a
// dependency isn't the right call for something this small, the same
// judgment general_programming_resources/05_dependency_management asks
// you to make every time before reaching for one.

import { coverageByTeam } from "../output/aggregate.ts";
import type { StoredEntry } from "../types.ts";

interface TeamCoverageChartProps {
  entries: StoredEntry[];
}

export function TeamCoverageChart({ entries }: TeamCoverageChartProps) {
  const coverage = coverageByTeam(entries);

  if (coverage.length === 0) {
    return <p>No entries yet — nothing to chart.</p>;
  }

  const max = Math.max(...coverage.map((row) => row.count));

  // The visual bars are decorative -- the real content is the sentence
  // in aria-label. A screen reader user gets the whole chart's data in
  // one announcement instead of having to interpret a row of <div>
  // widths, which carry no semantic meaning to anything but sighted
  // rendering. This is the same "the visual and the accessible version
  // don't have to be the same markup" idea 04_ui_ux_principles applied
  // to the alliance toggle, aimed at a chart instead of a form control.
  const summary = coverage
    .map((row) => `team ${row.teamNumber}, ${row.count} ${row.count === 1 ? "entry" : "entries"}`)
    .join("; ");

  return (
    <div className="coverage-chart">
      <div className="coverage-chart-bars" role="img" aria-label={`Entries scouted per team: ${summary}`}>
        {coverage.map((row) => (
          <div className="coverage-chart-row" key={row.teamNumber} aria-hidden="true">
            <span className="coverage-chart-label">{row.teamNumber}</span>
            <div className="coverage-chart-track">
              <div className="coverage-chart-bar" style={{ width: `${(row.count / max) * 100}%` }} />
            </div>
            <span className="coverage-chart-count">{row.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
