// output/aggregate.ts -- pure functions that turn a flat list of entries
// into the shape a summary view actually needs. No component in this
// topic reaches into `entries` directly to count or group anything --
// that logic lives here, once, so EntriesTable, TeamCoverageChart, and
// PickList all agree on what "how many times have we scouted team X"
// means, instead of three slightly different inline reductions.

import type { StoredEntry } from "../types.ts";

export interface TeamCoverage {
  teamNumber: string;
  count: number;
}

// Sorted by team number, not by count or first-appearance -- a
// strategist scanning this list already knows which team number they're
// looking for; alphabetizing (numerically) it is what makes it fast to
// find, the same reasoning a phone book uses.
export function coverageByTeam(entries: StoredEntry[]): TeamCoverage[] {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    counts.set(entry.teamNumber, (counts.get(entry.teamNumber) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([teamNumber, count]) => ({ teamNumber, count }))
    .sort((a, b) => Number(a.teamNumber) - Number(b.teamNumber));
}
