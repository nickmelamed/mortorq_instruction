// TeamLookup.tsx -- loads a real team list from either The Blue
// Alliance or a pasted CSV, and lets a scout pick a team number from it
// instead of typing one by hand. The team number field in ScoutingForm
// still exists and still validates on its own -- this is an assist on
// top of it, not a replacement, so the form still works exactly as it
// did in web_fundamentals_primer even if a scout skips this entirely.

import { useState } from "react";
import type { TbaTeam, FetchStatus } from "../api/types.ts";
import { fetchEventTeams, TbaRequestError } from "../api/tba.ts";
import { parseTeamsCsv } from "../api/csv.ts";

interface TeamLookupProps {
  onTeamSelected: (teamNumber: string) => void;
}

export function TeamLookup({ onTeamSelected }: TeamLookupProps) {
  const [eventKey, setEventKey] = useState("");
  const [csvText, setCsvText] = useState("");
  const [status, setStatus] = useState<FetchStatus<TbaTeam[]>>({ status: "idle" });

  async function handleLoadFromTba() {
    setStatus({ status: "loading" });
    try {
      const authKey = import.meta.env.VITE_TBA_AUTH_KEY ?? "";
      const teams = await fetchEventTeams(eventKey.trim(), authKey);
      setStatus({ status: "success", data: teams });
    } catch (error) {
      const message = error instanceof TbaRequestError ? error.message : "Something unexpected went wrong.";
      setStatus({ status: "error", message });
    }
  }

  function handleImportCsv() {
    const teams = parseTeamsCsv(csvText);
    setStatus({ status: "success", data: teams });
  }

  return (
    <div className="team-lookup">
      <p className="team-lookup-label">Load a real team list (optional)</p>

      <div className="team-lookup-source">
        <label htmlFor="event-key">TBA event key</label>
        <input
          id="event-key"
          placeholder="e.g. 2024casj"
          value={eventKey}
          onChange={(e) => setEventKey(e.target.value)}
        />
        <button type="button" onClick={handleLoadFromTba} disabled={status.status === "loading"}>
          Load from TBA
        </button>
      </div>

      <div className="team-lookup-source">
        <label htmlFor="csv-paste">...or paste CSV (team_number,nickname per line)</label>
        <textarea id="csv-paste" rows={3} value={csvText} onChange={(e) => setCsvText(e.target.value)} />
        <button type="button" onClick={handleImportCsv}>
          Import CSV
        </button>
      </div>

      {status.status === "loading" && <p role="status">Loading teams…</p>}

      {status.status === "error" && (
        <p role="alert" className="team-lookup-error">
          {status.message}
        </p>
      )}

      {status.status === "success" && status.data.length === 0 && (
        <p role="status">No teams found. Check the event key or CSV contents.</p>
      )}

      {status.status === "success" && status.data.length > 0 && (
        <label>
          Pick a team ({status.data.length} loaded)
          <select defaultValue="" onChange={(e) => e.target.value && onTeamSelected(e.target.value)}>
            <option value="" disabled>
              Select a team…
            </option>
            {status.data.map((team) => (
              <option key={team.key} value={String(team.team_number)}>
                {team.team_number} — {team.nickname}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}
