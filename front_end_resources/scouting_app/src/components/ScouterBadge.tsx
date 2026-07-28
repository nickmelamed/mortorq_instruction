// ScouterBadge.tsx -- the one place a scout sets their name for the
// session. ScoutingForm and EntryCard both read the same context value
// this writes to, live -- type here, and both update immediately,
// without either of them being a parent or child of the other.

import { useScouterIdentity } from "../context/ScouterIdentityContext.tsx";

export function ScouterBadge() {
  const { scouterName, setScouterName } = useScouterIdentity();

  return (
    <div className="scouter-badge">
      <label htmlFor="scouter-identity">Scouting as</label>
      <input
        id="scouter-identity"
        placeholder="Your name"
        autoComplete="off"
        value={scouterName}
        onChange={(e) => setScouterName(e.target.value)}
      />
    </div>
  );
}
