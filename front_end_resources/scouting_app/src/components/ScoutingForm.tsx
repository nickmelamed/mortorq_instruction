// ScoutingForm.tsx -- owns the in-progress entry as it's being typed.
//
// As of 04_hooks_and_lifecycle: also owns a keydown-driven keyboard
// shortcut (press "n" to jump to the team number field), which is what
// the useEffect + useRef below exist for. See concept.md for the full
// explanation of why the effect needs a cleanup function and useState
// alone couldn't do this job.

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { ScoutingEntry } from "../types.ts";
import { validateEntry } from "../validation.ts";
import { fakeSubmitToServer } from "../api.ts";

const emptyDraft: ScoutingEntry = {
  teamNumber: "",
  matchNumber: "",
  alliance: "red",
  scouterName: "",
  notes: "",
};

interface ScoutingFormProps {
  // The "events up" half of one-way data flow: ScoutingForm doesn't
  // decide what happens to a saved entry -- it hands the finished entry
  // back to whoever rendered it, via a function passed in as a prop.
  onEntrySaved: (entry: ScoutingEntry) => void;
}

export function ScoutingForm({ onEntrySaved }: ScoutingFormProps) {
  const [draft, setDraft] = useState<ScoutingEntry>(emptyDraft);
  const [errors, setErrors] = useState<Partial<Record<keyof ScoutingEntry, string>>>({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  // useRef, unlike useState, doesn't trigger a re-render when it changes --
  // it's just a mutable box that survives across renders. That's exactly
  // what an imperative DOM handle needs: nothing about focusing an input
  // is "this component's output changed," so re-rendering for it would be
  // both unnecessary and wrong.
  const teamNumberInputRef = useRef<HTMLInputElement>(null);

  function updateField<K extends keyof ScoutingEntry>(field: K, value: ScoutingEntry[K]) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  // Acquire (add the listener) once, on mount ([] -- no dependencies).
  // Release (remove it) once, on unmount, via the returned cleanup
  // function. Skipping the cleanup here would mean every remount of this
  // component stacks up one more "n" listener that never goes away.
  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      const isTypingElsewhere = document.activeElement instanceof HTMLElement
        && ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName);
      if (event.key === "n" && !isTypingElsewhere) {
        event.preventDefault();
        teamNumberInputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validateEntry(draft);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    setSaving(true);
    setStatus("Saving...");

    const saved = await fakeSubmitToServer(result.entry);
    onEntrySaved(saved);

    setStatus("Saved.");
    setSaving(false);
    setDraft(emptyDraft);
    setTimeout(() => setStatus(""), 2000);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <fieldset>
        <legend>New entry</legend>

        <div className={`field${errors.teamNumber ? " invalid" : ""}`}>
          <label htmlFor="team-number">Team number</label>
          <input
            id="team-number"
            ref={teamNumberInputRef}
            inputMode="numeric"
            autoComplete="off"
            value={draft.teamNumber}
            onChange={(e) => updateField("teamNumber", e.target.value)}
          />
          <p className="error">{errors.teamNumber}</p>
        </div>

        <div className={`field${errors.matchNumber ? " invalid" : ""}`}>
          <label htmlFor="match-number">Match number</label>
          <input
            id="match-number"
            inputMode="numeric"
            autoComplete="off"
            value={draft.matchNumber}
            onChange={(e) => updateField("matchNumber", e.target.value)}
          />
          <p className="error">{errors.matchNumber}</p>
        </div>

        <div className="field">
          <label htmlFor="alliance">Alliance</label>
          <select
            id="alliance"
            value={draft.alliance}
            onChange={(e) => updateField("alliance", e.target.value as ScoutingEntry["alliance"])}
          >
            <option value="red">Red</option>
            <option value="blue">Blue</option>
          </select>
        </div>

        <div className={`field${errors.scouterName ? " invalid" : ""}`}>
          <label htmlFor="scouter-name">Scouter name</label>
          <input
            id="scouter-name"
            autoComplete="off"
            value={draft.scouterName}
            onChange={(e) => updateField("scouterName", e.target.value)}
          />
          <p className="error">{errors.scouterName}</p>
        </div>

        <div className="field field--wide">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            rows={3}
            value={draft.notes}
            onChange={(e) => updateField("notes", e.target.value)}
          />
        </div>

        <div className="field field--actions">
          <button type="submit" disabled={saving}>
            Submit
          </button>
          <span role="status" aria-live="polite">
            {status}
          </span>
        </div>
      </fieldset>
    </form>
  );
}
