// render.ts -- writing a ScoutingEntry back into the DOM. Typed against
// the real shape defined in types.ts, so a typo in a field name here
// (entry.mathNumber instead of entry.matchNumber) is a compile error,
// not a silent `undefined` you only notice by staring at the page.

import type { ScoutingEntry } from "./types.ts";
import { requireElement } from "./validation.ts";

export function renderEntry(entry: ScoutingEntry): void {
  const entriesEl = requireElement<HTMLElement>("entries");
  const entriesEmptyEl = requireElement<HTMLElement>("entries-empty");
  entriesEmptyEl.hidden = true;

  const card = document.createElement("article");
  card.className = "entry-card";

  const heading = document.createElement("h3");
  heading.textContent = `Team ${entry.teamNumber} — Match ${entry.matchNumber}`;
  card.appendChild(heading);

  const allianceLine = document.createElement("p");
  const allianceSpan = document.createElement("span");
  allianceSpan.className = `alliance-${entry.alliance}`;
  allianceSpan.textContent = entry.alliance === "red" ? "Red alliance" : "Blue alliance";
  allianceLine.appendChild(allianceSpan);
  card.appendChild(allianceLine);

  const scouterLine = document.createElement("p");
  scouterLine.textContent = `Scouted by ${entry.scouterName}`;
  card.appendChild(scouterLine);

  if (entry.notes) {
    const notesLine = document.createElement("p");
    notesLine.textContent = entry.notes;
    card.appendChild(notesLine);
  }

  const insertBeforeNode = entriesEl.firstChild === entriesEmptyEl ? entriesEmptyEl.nextSibling : entriesEl.firstChild;
  entriesEl.insertBefore(card, insertBeforeNode);
}
