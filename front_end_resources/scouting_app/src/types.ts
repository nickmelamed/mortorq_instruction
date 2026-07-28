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

// A discriminated union: the `valid` field's literal type (`true` vs.
// `false`) tells the compiler which of the two shapes you're holding.
// Inside an `if (result.valid)` check, TypeScript narrows the type on
// its own -- `result.entry` is only accessible where `valid` is `true`,
// with no cast, no `!`, and no runtime check beyond the one you already
// wrote for validation itself.
export type ValidationResult =
  | { valid: true; entry: ScoutingEntry }
  | { valid: false };
