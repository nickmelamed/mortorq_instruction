// PickList.tsx -- the actual output. Everything else in this app exists
// to produce this: a ranked list a strategist can read off during
// alliance selection. Reordering is "Move up" / "Move down" buttons, not
// drag-and-drop -- the same reasoning 04_ui_ux_principles gave for the
// alliance toggle applies here even more directly: a drag gesture has no
// keyboard equivalent at all, where a button always does.
//
// Ranking itself is entirely manual, on purpose. Nothing here tries to
// compute a "best" team from entry count or anything else in the data --
// entry count measures how much a team has been scouted, not how good
// they are. The judgment of turning notes into a ranking stays with the
// strategist reading them; this just gives them a place to record and
// reorder that judgment.

import { useEffect, useState } from "react";
import { coverageByTeam } from "../output/aggregate.ts";
import { getPickListOrder, savePickListOrder } from "../output/pickListStorage.ts";
import type { StoredEntry } from "../types.ts";

interface PickListProps {
  entries: StoredEntry[];
}

export function PickList({ entries }: PickListProps) {
  const coverage = coverageByTeam(entries);
  const countByTeam = new Map(coverage.map((row) => [row.teamNumber, row.count]));

  const [order, setOrder] = useState<string[]>(() => {
    const stored = getPickListOrder();
    const known = new Set(stored);
    const missing = coverage.map((row) => row.teamNumber).filter((team) => !known.has(team));
    return [...stored, ...missing];
  });

  // Entries only ever get added in this app, never removed -- so a team
  // that was in `order` yesterday is still a real team today, just
  // possibly with a higher count. The only reconciliation this ever
  // needs is appending teams that are newly-scouted since `order` was
  // last saved.
  useEffect(() => {
    const known = new Set(order);
    const missing = coverage.map((row) => row.teamNumber).filter((team) => !known.has(team));
    if (missing.length === 0) return;
    setOrder((prev) => {
      const next = [...prev, ...missing];
      savePickListOrder(next);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reconciles against `entries` itself, not `order`/`coverage` derived from it
  }, [entries]);

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= order.length) return;

    const next = [...order];
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
    savePickListOrder(next);
  }

  if (order.length === 0) {
    return <p>No teams scouted yet — your pick list starts once you have entries.</p>;
  }

  return (
    <ol className="pick-list">
      {order.map((teamNumber, index) => {
        const count = countByTeam.get(teamNumber) ?? 0;
        return (
          <li className="pick-list-row" key={teamNumber}>
            <span className="pick-list-rank">{index + 1}</span>
            <span className="pick-list-team">Team {teamNumber}</span>
            <span className="pick-list-count">
              {count} {count === 1 ? "entry" : "entries"}
            </span>
            <span className="pick-list-actions">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label={`Move team ${teamNumber} up`}
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === order.length - 1}
                aria-label={`Move team ${teamNumber} down`}
              >
                ▼
              </button>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
