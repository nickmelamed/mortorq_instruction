// validation.ts -- reading raw form values and turning them into either
// a valid ScoutingEntry or a rejection, with every step typed.

import type { Alliance, ScoutingEntry, ValidationResult } from "./types.ts";

// requireElement<T> reads an element out of the DOM and throws if it's
// missing, instead of handing back `null` for the caller to forget to
// check. document.getElementById's real return type is `HTMLElement | null`
// -- in plain JS (01_foundations/scouting-form/script.js) nothing stopped
// you from using that value as if it were never null. Here, the compiler
// won't let a caller touch `.value` on the result of requireElement's
// return type, because the return type itself has no `null` in it -- the
// null case was handled once, here, instead of trusted-and-forgotten at
// every call site. Directly the same discipline systems_primer/
// 08_error_handling_fault_tolerance argues for ("confirm it's actually
// there before using it"), just enforced by the compiler instead of a
// habit you have to remember.
function requireElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (el === null) {
    throw new Error(`Expected an element with id="${id}" to exist in the DOM.`);
  }
  return el as T;
}

function clearFieldError(fieldId: string): void {
  const errorEl = document.getElementById(`${fieldId}-error`);
  if (errorEl) errorEl.textContent = "";
  requireElement<HTMLInputElement>(fieldId).closest(".field")?.classList.remove("invalid");
}

function setFieldError(fieldId: string, message: string): void {
  requireElement<HTMLElement>(`${fieldId}-error`).textContent = message;
  requireElement<HTMLInputElement>(fieldId).closest(".field")?.classList.add("invalid");
}

export function readAndValidateForm(): ValidationResult {
  const teamNumberRaw = requireElement<HTMLInputElement>("team-number").value.trim();
  const matchNumberRaw = requireElement<HTMLInputElement>("match-number").value.trim();
  // TypeScript can't verify a <select>'s value is really "red" | "blue"
  // at compile time -- that's decided by index.html's markup, which the
  // compiler doesn't read. This cast is a promise you're making to the
  // compiler, not a check it performed for you; it's only trustworthy
  // because index.html's <option> values are the only two the browser
  // will ever hand back here.
  const alliance = requireElement<HTMLSelectElement>("alliance").value as Alliance;
  const scouterName = requireElement<HTMLInputElement>("scouter-name").value.trim();
  const notes = requireElement<HTMLTextAreaElement>("notes").value.trim();

  (["team-number", "match-number", "scouter-name"] as const).forEach(clearFieldError);

  let valid = true;

  if (!/^\d+$/.test(teamNumberRaw)) {
    setFieldError("team-number", "Team number must be a whole number.");
    valid = false;
  }

  if (!/^\d+$/.test(matchNumberRaw)) {
    setFieldError("match-number", "Match number must be a whole number.");
    valid = false;
  }

  if (scouterName.length === 0) {
    setFieldError("scouter-name", "Enter your name so we know who scouted this.");
    valid = false;
  }

  if (!valid) return { valid: false };

  const entry: ScoutingEntry = {
    teamNumber: teamNumberRaw,
    matchNumber: matchNumberRaw,
    alliance,
    scouterName,
    notes,
  };

  return { valid: true, entry };
}

export { requireElement };
