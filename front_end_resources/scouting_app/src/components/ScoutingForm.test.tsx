// ScoutingForm.test.tsx -- one level up the pyramid from validation.test.ts:
// this renders a real component tree (ScouterIdentityProvider +
// ScouterBadge + ScoutingForm together, the same integration
// 03_state_as_a_systems_problem's concept.md describes) and drives it the
// way a scout actually would -- by label text and role, through
// @testing-library/user-event, never by reaching into component internals.
//
// api/scouting.ts is mocked. A real saveEntry() either makes a genuine
// network call to Supabase or waits out fakeSubmitToServer's artificial
// 400-1000ms delay -- neither belongs in a test that should run in
// milliseconds and never depend on a network being reachable. The mock
// still returns a real StoredEntry shape, not an empty object -- a mock
// is only as useful as how faithfully it stands in for the real thing,
// exactly the caution general_programming_resources/07_testing_philosophy
// raises about over-mocking.

import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ScouterIdentityProvider } from "../context/ScouterIdentityContext.tsx";
import { ScouterBadge } from "./ScouterBadge.tsx";
import { ScoutingForm } from "./ScoutingForm.tsx";
import * as scoutingApi from "../api/scouting.ts";
import type { StoredEntry } from "../types.ts";

vi.mock("../api/scouting.ts", () => ({
  saveEntry: vi.fn(),
}));

function renderForm() {
  const onEntrySaved = vi.fn();
  render(
    <ScouterIdentityProvider>
      <ScouterBadge />
      <ScoutingForm onEntrySaved={onEntrySaved} />
    </ScouterIdentityProvider>,
  );
  return onEntrySaved;
}

beforeEach(() => {
  vi.mocked(scoutingApi.saveEntry).mockReset();
});

describe("ScoutingForm", () => {
  it("shows a validation error and never calls saveEntry when required fields are blank", async () => {
    const user = userEvent.setup();
    const onEntrySaved = renderForm();

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByText("Enter your name so we know who scouted this.")).toBeInTheDocument();
    expect(scoutingApi.saveEntry).not.toHaveBeenCalled();
    expect(onEntrySaved).not.toHaveBeenCalled();
  });

  it("saves a valid entry and hands the result to onEntrySaved", async () => {
    const user = userEvent.setup();
    const savedEntry: StoredEntry = {
      id: "test-id",
      teamNumber: "1515",
      matchNumber: "3",
      alliance: "red",
      scouterName: "Ada",
      notes: "Good auto.",
    };
    vi.mocked(scoutingApi.saveEntry).mockResolvedValue(savedEntry);
    const onEntrySaved = renderForm();

    await user.type(screen.getByLabelText("Scouting as"), "Ada");
    await user.type(screen.getByLabelText("Team number"), "1515");
    await user.type(screen.getByLabelText("Match number"), "3");
    await user.type(screen.getByLabelText("Notes"), "Good auto.");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => expect(onEntrySaved).toHaveBeenCalledWith(savedEntry));
    expect(scoutingApi.saveEntry).toHaveBeenCalledWith(
      expect.objectContaining({ teamNumber: "1515", matchNumber: "3", scouterName: "Ada" }),
    );
  });
});
