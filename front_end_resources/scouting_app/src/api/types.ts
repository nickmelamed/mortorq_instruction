// api/types.ts -- shapes for talking to the outside world, kept
// separate from ../types.ts's scouting-domain shapes on purpose: a
// ScoutingEntry is something this app owns and defines; a TbaTeam is
// something The Blue Alliance owns and defines, and this file only
// declares the small slice of it this app actually uses.

export interface TbaTeam {
  key: string; // e.g. "frc1515"
  team_number: number;
  nickname: string;
}

// A generic status type for "a thing we fetched," reused by every data
// source this module adds (TBA, CSV import, and Statbotics in the
// exercises). The three states here are the same three concept.md
// argues are a design requirement, not an afterthought: loading, error,
// and success -- and success still has to account for an empty result.
export type FetchStatus<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };
