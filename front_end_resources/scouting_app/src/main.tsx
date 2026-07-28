// main.ts -- event wiring. Same shape as 01_foundations/scouting-form/
// script.js's submit handler, now operating entirely on typed values.

import "./style.css";
import { readAndValidateForm, requireElement } from "./validation.ts";
import { renderEntry } from "./render.ts";
import { fakeSubmitToServer } from "./api.ts";
import type { ScoutingEntry } from "./types.ts";

const form = requireElement<HTMLFormElement>("scouting-form");
const submitButton = requireElement<HTMLButtonElement>("submit-button");
const statusEl = requireElement<HTMLElement>("status");

// Still in-memory only, still gone on refresh. Still not this primer's
// problem to solve -- see frontend_systems_primer/01_consuming_apis.
const entries: ScoutingEntry[] = [];

form.addEventListener("submit", async (event: SubmitEvent) => {
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

  setTimeout(() => {
    statusEl.textContent = "";
  }, 2000);
});
