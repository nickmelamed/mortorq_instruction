// api/csv.ts -- the low-infrastructure alternative to api/tba.ts.
// Google Sheets doesn't have a zero-setup public API the way TBA does --
// reading a real sheet means OAuth or a service account, which is real
// infrastructure this module isn't going to make you stand up for one
// lesson. The realistic bridge most teams actually use is simpler:
// export the sheet you already have as a CSV, and import that.
//
// Deliberately returns the exact same TbaTeam[] shape api/tba.ts does.
// TeamLookup.tsx doesn't know or care which of the two produced its
// data -- both are just "a list of teams," from different sources.

import type { TbaTeam } from "./types.ts";

export function parseTeamsCsv(csvText: string): TbaTeam[] {
  const teams: TbaTeam[] = [];

  for (const rawLine of csvText.split("\n")) {
    const line = rawLine.trim();
    if (line.length === 0) continue;

    const [teamNumberRaw, nicknameRaw] = line.split(",");
    const teamNumber = Number.parseInt((teamNumberRaw ?? "").trim(), 10);

    // Skips a header row ("team_number,nickname") for free: header text
    // doesn't parse as an integer, so it's silently not a valid row,
    // the same way a non-numeric team number never was.
    if (Number.isNaN(teamNumber)) continue;

    teams.push({
      key: `frc${teamNumber}`,
      team_number: teamNumber,
      nickname: (nicknameRaw ?? "").trim() || `Team ${teamNumber}`,
    });
  }

  return teams;
}
