// types.ts -- the shapes of data this app passes around. No logic here,
// on purpose: a type is a claim about shape, not behavior.

// A union of exactly two string literals -- not `string`. `string` would
// accept "Red", "RED", "purple", or a typo like "rde" without complaint.
// This type accepts exactly two values, and the compiler checks every
// place one gets used against that.
export type Alliance = "red" | "blue";

export interface ScoutingEntry {
  teamNumber: string;
  matchNumber: string;
  alliance: Alliance;
  scouterName: string;
  notes: string;
}

// What EntryList/EntryCard actually render: a saved ScoutingEntry plus an
// id assigned once it's stored. Kept separate from ScoutingEntry itself --
// a fresh entry a form is validating doesn't have an id yet, and doesn't
// need one until App decides to keep it.
export interface StoredEntry extends ScoutingEntry {
  id: string;
}

// A discriminated union, same idea as 02_why_typescript's version, now
// carrying field-level error messages in the invalid case so ScoutingForm
// can show each one next to the field it belongs to.
export type ValidationResult =
  | { valid: true; entry: ScoutingEntry }
  | { valid: false; errors: Partial<Record<keyof ScoutingEntry, string>> };
