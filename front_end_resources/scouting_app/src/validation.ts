// validation.ts -- in 02_why_typescript, this file's job started with
// requireElement(), reading raw values out of the DOM. It doesn't need
// to do that anymore: ScoutingForm already holds every field's current
// value in React state, so validation is now a plain, pure function --
// draft in, result out, no DOM involved at all. This is the single
// clearest example of what React is actually doing for you: the
// component's state *is* the source of truth, instead of the DOM being
// the source of truth and your code re-reading it every time.

import type { ScoutingEntry, ValidationResult } from "./types.ts";

export function validateEntry(draft: ScoutingEntry): ValidationResult {
  const teamNumber = draft.teamNumber.trim();
  const matchNumber = draft.matchNumber.trim();
  const scouterName = draft.scouterName.trim();

  const errors: Partial<Record<keyof ScoutingEntry, string>> = {};

  if (!/^\d+$/.test(teamNumber)) {
    errors.teamNumber = "Team number must be a whole number.";
  }

  if (!/^\d+$/.test(matchNumber)) {
    errors.matchNumber = "Match number must be a whole number.";
  }

  if (scouterName.length === 0) {
    errors.scouterName = "Enter your name so we know who scouted this.";
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    entry: {
      teamNumber,
      matchNumber,
      alliance: draft.alliance,
      scouterName,
      notes: draft.notes.trim(),
    },
  };
}
