// ScoutingForm.tsx -- owns the in-progress entry as it's being typed.
//
// As of 04_hooks_and_lifecycle: also owns a keydown-driven keyboard
// shortcut (press "n" to jump to the team number field), which is what
// the useEffect + useRef below exist for.
//
// As of 03_state_as_a_systems_problem: no longer owns a "scouter name"
// field at all -- that's session-level identity now, read from
// ScouterIdentityContext -- and its submit status is one state machine
// instead of two booleans that had to be kept in sync by hand.

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { ScoutingEntry, StoredEntry } from "../types.ts";
import { validateEntry } from "../validation.ts";
import { saveEntry } from "../api/scouting.ts";
import { TeamLookup } from "./TeamLookup.tsx";
import { useScouterIdentity } from "../context/ScouterIdentityContext.tsx";

const emptyDraft: Omit<ScoutingEntry, "scouterName"> = {
  teamNumber: "",
  matchNumber: "",
  alliance: "red",
  notes: "",
};

// The same shape systems_primer/03_state_machines argued for by hand,
// applied here: one named state at a time instead of a `saving: boolean`
// and a `status: string` that were supposed to always agree with each
// other but had nothing enforcing it. Ask "what is this form doing right
// now?" and the answer is always exactly one of these four -- there's no
// way to end up with saving === true and an error message displayed at
// the same time, because that would require being in two states at once.
type SubmitStatus =
  | { phase: "idle" }
  | { phase: "saving" }
  | { phase: "saved" }
  | { phase: "error"; message: string };

interface ScoutingFormProps {
  // The "events up" half of one-way data flow: ScoutingForm doesn't
  // decide what happens to a saved entry -- it hands the finished entry
  // back to whoever rendered it, via a function passed in as a prop.
  // saveEntry() (real Supabase insert or in-memory fallback) is what
  // decides the entry's id now, not App -- see api/scouting.ts.
  onEntrySaved: (entry: StoredEntry) => void;
}

export function ScoutingForm({ onEntrySaved }: ScoutingFormProps) {
  const { scouterName } = useScouterIdentity();
  const [draft, setDraft] = useState(emptyDraft);
  const [errors, setErrors] = useState<Partial<Record<keyof ScoutingEntry, string>>>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({ phase: "idle" });

  // useRef, unlike useState, doesn't trigger a re-render when it changes --
  // it's just a mutable box that survives across renders. That's exactly
  // what an imperative DOM handle needs: nothing about focusing an input
  // is "this component's output changed," so re-rendering for it would be
  // both unnecessary and wrong.
  const teamNumberInputRef = useRef<HTMLInputElement>(null);

  function updateField<K extends keyof typeof emptyDraft>(field: K, value: (typeof emptyDraft)[K]) {
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

    // scouterName comes from context, not from a field in this form --
    // still validated the same way, just merged in here instead of typed
    // into a per-entry input.
    const candidate: ScoutingEntry = { ...draft, scouterName };
    const result = validateEntry(candidate);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    setSubmitStatus({ phase: "saving" });

    // Unlike fakeSubmitToServer, saveEntry can genuinely fail now (a real
    // network call to Supabase can time out, get rejected, etc.) -- so
    // this needs a real error path, not just a success path. On failure,
    // the draft is deliberately left exactly as it was: a scout who just
    // typed three sentences of notes should never lose them because a
    // request failed.
    try {
      const saved = await saveEntry(result.entry);
      onEntrySaved(saved);
      setSubmitStatus({ phase: "saved" });
      setDraft(emptyDraft);
      // Fast, error-resistant entry under time pressure means the next
      // entry should be one keystroke away, not a tap back into the team
      // number field every single time -- a scout entering a dozen
      // matches in a row shouldn't have to reach for the mouse/trackpad
      // (or find the field by hand on a tablet) after every submission.
      teamNumberInputRef.current?.focus();
      setTimeout(() => setSubmitStatus({ phase: "idle" }), 2000);
    } catch (error) {
      setSubmitStatus({
        phase: "error",
        message: error instanceof Error ? error.message : "Could not save this entry.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <TeamLookup onTeamSelected={(teamNumber) => updateField("teamNumber", teamNumber)} />

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
            aria-invalid={Boolean(errors.teamNumber)}
            aria-describedby="team-number-error"
          />
          <p className="error" id="team-number-error">
            {errors.teamNumber}
          </p>
        </div>

        <div className={`field${errors.matchNumber ? " invalid" : ""}`}>
          <label htmlFor="match-number">Match number</label>
          <input
            id="match-number"
            inputMode="numeric"
            autoComplete="off"
            value={draft.matchNumber}
            onChange={(e) => updateField("matchNumber", e.target.value)}
            aria-invalid={Boolean(errors.matchNumber)}
            aria-describedby="match-number-error"
          />
          <p className="error" id="match-number-error">
            {errors.matchNumber}
          </p>
        </div>

        {/* Native radio inputs, not a styled <div onClick>: a real
            radiogroup gets arrow-key navigation and screen-reader
            announcement ("Red, radio button, 1 of 2") for free. The
            inputs themselves are visually-hidden, not display:none --
            display:none would remove them from the tab order and from
            assistive tech entirely. Big tap targets exist because a
            two-option <select> costs a scout two taps (open, then pick)
            under time pressure, where this costs one. */}
        <fieldset className="alliance-toggle">
          <legend>Alliance</legend>
          <label className={`alliance-option alliance-option--red${draft.alliance === "red" ? " selected" : ""}`}>
            <input
              className="visually-hidden"
              type="radio"
              name="alliance"
              value="red"
              checked={draft.alliance === "red"}
              onChange={() => updateField("alliance", "red")}
            />
            Red
          </label>
          <label className={`alliance-option alliance-option--blue${draft.alliance === "blue" ? " selected" : ""}`}>
            <input
              className="visually-hidden"
              type="radio"
              name="alliance"
              value="blue"
              checked={draft.alliance === "blue"}
              onChange={() => updateField("alliance", "blue")}
            />
            Blue
          </label>
        </fieldset>

        <div className={`field${errors.scouterName ? " invalid" : ""}`}>
          <p className="scouter-readout">
            Scouting as <strong>{scouterName || "(not set)"}</strong> — set your name above, next to the title.
          </p>
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
          <button type="submit" disabled={submitStatus.phase === "saving"}>
            Submit
          </button>
          <span role="status" aria-live="polite">
            {submitStatus.phase === "saving" && "Saving..."}
            {submitStatus.phase === "saved" && "Saved."}
            {submitStatus.phase === "error" && submitStatus.message}
          </span>
        </div>
      </fieldset>
    </form>
  );
}
