// script.js -- reads the DOM, validates input, writes new entries back into
// the DOM, and simulates an async save. No framework: every DOM read/write
// below is something React will later do for you automatically -- see
// 03_react_core for the side-by-side comparison.

const form = document.getElementById("scouting-form");
const submitButton = document.getElementById("submit-button");
const statusEl = document.getElementById("status");
const entriesEl = document.getElementById("entries");
const entriesEmptyEl = document.getElementById("entries-empty");

// In-memory only. Nothing here survives a refresh -- that's intentional.
// frontend_systems_primer/01_consuming_apis and 05_offline_and_multi_user
// are where "survives a refresh" and "survives losing wifi" get solved.
const entries = [];

// --- Validation -------------------------------------------------------

// Clears a field's error state. Called at the start of every validation
// pass so a fixed field doesn't keep showing a stale error message.
function clearFieldError(fieldId) {
  const errorEl = document.getElementById(`${fieldId}-error`);
  if (errorEl) errorEl.textContent = "";
  const inputEl = document.getElementById(fieldId);
  inputEl.closest(".field").classList.remove("invalid");
}

function setFieldError(fieldId, message) {
  const errorEl = document.getElementById(`${fieldId}-error`);
  errorEl.textContent = message;
  document.getElementById(fieldId).closest(".field").classList.add("invalid");
}

// Reads every field out of the DOM, validates it, and returns either
// { valid: true, entry: {...} } or { valid: false } (with error messages
// already written into the DOM as a side effect).
function readAndValidateForm() {
  const teamNumberRaw = document.getElementById("team-number").value.trim();
  const matchNumberRaw = document.getElementById("match-number").value.trim();
  const alliance = document.getElementById("alliance").value;
  const scouterName = document.getElementById("scouter-name").value.trim();
  const notes = document.getElementById("notes").value.trim();

  ["team-number", "match-number", "scouter-name"].forEach(clearFieldError);

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

  return {
    valid: true,
    entry: {
      teamNumber: teamNumberRaw,
      matchNumber: matchNumberRaw,
      alliance,
      scouterName,
      notes,
    },
  };
}

// --- Fake async save ----------------------------------------------------

// Stands in for a real network request. Resolves after a random, realistic
// delay so the UI genuinely has to handle "this takes a while," the same
// way a real fetch() to a backend would. Swapped for a real API call in
// frontend_systems_primer/01_consuming_apis.
function fakeSubmitToServer(entry) {
  return new Promise((resolve) => {
    const delayMs = 400 + Math.random() * 600;
    setTimeout(() => resolve(entry), delayMs);
  });
}

// --- Rendering ------------------------------------------------------

function renderEntry(entry) {
  entriesEmptyEl.hidden = true;

  const card = document.createElement("article");
  card.className = "entry-card";

  const heading = document.createElement("h3");
  heading.textContent = `Team ${entry.teamNumber} — Match ${entry.matchNumber}`;
  card.appendChild(heading);

  const allianceLine = document.createElement("p");
  const allianceSpan = document.createElement("span");
  allianceSpan.className = `alliance-${entry.alliance}`;
  allianceSpan.textContent = entry.alliance === "red" ? "Red alliance" : "Blue alliance";
  allianceLine.appendChild(allianceSpan);
  card.appendChild(allianceLine);

  const scouterLine = document.createElement("p");
  scouterLine.textContent = `Scouted by ${entry.scouterName}`;
  card.appendChild(scouterLine);

  if (entry.notes) {
    const notesLine = document.createElement("p");
    notesLine.textContent = entry.notes;
    card.appendChild(notesLine);
  }

  // Newest entry first.
  entriesEl.insertBefore(card, entriesEl.firstChild === entriesEmptyEl ? entriesEmptyEl.nextSibling : entriesEl.firstChild);
}

// --- Event wiring -----------------------------------------------------

form.addEventListener("submit", async (event) => {
  // Without this, the browser's default behavior is to submit the form
  // as a real HTTP request and reload the page -- exactly what the
  // "before" version of this file did, and exactly what throws away
  // every value you just typed.
  event.preventDefault();

  const result = readAndValidateForm();
  if (!result.valid) return;

  submitButton.disabled = true;
  statusEl.textContent = "Saving...";

  const saved = await fakeSubmitToServer(result.entry);

  entries.push(saved);
  renderEntry(saved);

  statusEl.textContent = "Saved.";
  submitButton.disabled = false;
  form.reset();

  // Clear the "Saved." status a couple seconds later so it doesn't sit
  // there forever looking like stale information.
  setTimeout(() => {
    statusEl.textContent = "";
  }, 2000);
});
