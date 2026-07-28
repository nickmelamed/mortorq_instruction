// EntryCard.tsx -- replaces 02_why_typescript's render.ts entirely.
// renderEntry() there had to manually document.createElement() a whole
// tree, one node at a time, and manually insertBefore() it into the
// right spot. This just describes what one entry's markup should look
// like, given an entry; React handles turning that description into
// real DOM nodes, and into DOM updates when the data behind it changes.
//
// As of 03_state_as_a_systems_problem: also reads scouterName straight
// out of ScouterIdentityContext, two levels below the App that provides
// it, without EntryList (its direct parent) ever seeing that value pass
// through. That's the actual point of Context -- not "shared state" in
// the abstract, but skipping a component that has no reason to know
// this value exists.

import type { StoredEntry } from "../types.ts";
import { useScouterIdentity } from "../context/ScouterIdentityContext.tsx";

interface EntryCardProps {
  entry: StoredEntry;
}

export function EntryCard({ entry }: EntryCardProps) {
  const { scouterName } = useScouterIdentity();
  const isMine = scouterName.length > 0 && entry.scouterName === scouterName;

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
      <p>
        Scouted by {entry.scouterName}
        {isMine && " (you)"}
      </p>
      {entry.notes && <p>{entry.notes}</p>}
    </article>
  );
}
