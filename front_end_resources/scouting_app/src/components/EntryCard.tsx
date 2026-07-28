// EntryCard.tsx -- replaces 02_why_typescript's render.ts entirely.
// renderEntry() there had to manually document.createElement() a whole
// tree, one node at a time, and manually insertBefore() it into the
// right spot. This just describes what one entry's markup should look
// like, given an entry; React handles turning that description into
// real DOM nodes, and into DOM updates when the data behind it changes.

import type { StoredEntry } from "../types.ts";

interface EntryCardProps {
  entry: StoredEntry;
}

export function EntryCard({ entry }: EntryCardProps) {
  return (
    <article className="entry-card">
      <h3>
        Team {entry.teamNumber} — Match {entry.matchNumber}
      </h3>
      <p>
        <span className={`alliance-${entry.alliance}`}>
          {entry.alliance === "red" ? "Red alliance" : "Blue alliance"}
        </span>
      </p>
      <p>Scouted by {entry.scouterName}</p>
      {entry.notes && <p>{entry.notes}</p>}
    </article>
  );
}
