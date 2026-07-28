// EntriesTable.tsx -- the same entries EntryList already renders as
// cards, in a different shape entirely. Cards are for a scout glancing
// at what just got submitted; a table sorted by whichever column you
// click is for the very different job of comparing entries against each
// other before alliance selection. Same data, two views, because they
// serve two different tasks -- not because one view is more "advanced"
// than the other.

import { useState } from "react";
import type { StoredEntry } from "../types.ts";

type SortKey = "teamNumber" | "matchNumber" | "alliance" | "scouterName";
type SortDirection = "asc" | "desc";

interface Column {
  key: SortKey;
  label: string;
}

const columns: Column[] = [
  { key: "teamNumber", label: "Team" },
  { key: "matchNumber", label: "Match" },
  { key: "alliance", label: "Alliance" },
  { key: "scouterName", label: "Scouter" },
];

function compare(a: StoredEntry, b: StoredEntry, key: SortKey): number {
  if (key === "teamNumber" || key === "matchNumber") {
    return Number(a[key]) - Number(b[key]);
  }
  return a[key].localeCompare(b[key]);
}

interface EntriesTableProps {
  entries: StoredEntry[];
}

export function EntriesTable({ entries }: EntriesTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("matchNumber");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection("asc");
  }

  const sorted = [...entries].sort((a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1;
    return compare(a, b, sortKey) * direction;
  });

  if (entries.length === 0) {
    return <p>No entries yet — nothing to sort.</p>;
  }

  return (
    <table className="entries-table">
      <caption>All entries, sortable by column</caption>
      <thead>
        <tr>
          {columns.map((column) => {
            // aria-sort belongs on the <th>, not the button inside it --
            // it's a property of the column, and it's how a screen
            // reader announces "Team, column header, sorted ascending"
            // instead of leaving that state entirely invisible to
            // anyone not looking at the arrow glyph.
            const isActive = column.key === sortKey;
            const ariaSort = isActive ? (sortDirection === "asc" ? "ascending" : "descending") : "none";
            return (
              <th key={column.key} aria-sort={ariaSort}>
                <button type="button" onClick={() => handleSort(column.key)}>
                  {column.label}
                  {isActive && <span aria-hidden="true"> {sortDirection === "asc" ? "▲" : "▼"}</span>}
                </button>
              </th>
            );
          })}
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((entry) => (
          <tr key={entry.id}>
            <td>{entry.teamNumber}</td>
            <td>{entry.matchNumber}</td>
            <td>
              <span className={`alliance-${entry.alliance}`}>{entry.alliance}</span>
            </td>
            <td>{entry.scouterName}</td>
            <td className="entries-table-notes" title={entry.notes}>
              {entry.notes}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
