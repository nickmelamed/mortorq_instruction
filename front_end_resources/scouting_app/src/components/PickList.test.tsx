// PickList.test.tsx -- the boundary case 06_visualization_and_output's
// exercise-2 had you break by hand, encoded as a test instead: if this
// keeps passing, nobody has to re-discover that bug by watching the pick
// list corrupt itself in front of them. That's the actual argument for
// writing this test at all -- not "more tests are good," but "this
// specific thing broke once, in a specific way, and should never get to
// again without a red test telling us immediately."

import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PickList } from "./PickList.tsx";
import type { StoredEntry } from "../types.ts";

function makeEntry(overrides: Partial<StoredEntry>): StoredEntry {
  return {
    id: crypto.randomUUID(),
    teamNumber: "1515",
    matchNumber: "1",
    alliance: "red",
    scouterName: "Ada",
    notes: "",
    ...overrides,
  };
}

// coverageByTeam sorts by team number ascending, so with no stored order
// yet, the pick list should start out as 118, 254, 1515 -- regardless of
// the order these entries were scouted in.
const entries: StoredEntry[] = [
  makeEntry({ teamNumber: "1515" }),
  makeEntry({ teamNumber: "254" }),
  makeEntry({ teamNumber: "118" }),
];

function renderedTeamNames(): string[] {
  return screen.getAllByText(/^Team \d+$/).map((el) => el.textContent ?? "");
}

beforeEach(() => {
  localStorage.clear();
});

describe("PickList", () => {
  it("starts ranked by team number when nothing has been saved yet", () => {
    render(<PickList entries={entries} />);
    expect(renderedTeamNames()).toEqual(["Team 118", "Team 254", "Team 1515"]);
  });

  it("moves a team up a rank when its 'Move up' button is clicked", async () => {
    const user = userEvent.setup();
    render(<PickList entries={entries} />);

    await user.click(screen.getByRole("button", { name: "Move team 254 up" }));

    expect(renderedTeamNames()).toEqual(["Team 254", "Team 118", "Team 1515"]);
  });

  it("disables 'Move up' on the top row and 'Move down' on the bottom row", () => {
    render(<PickList entries={entries} />);

    expect(screen.getByRole("button", { name: "Move team 118 up" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Move team 1515 down" })).toBeDisabled();
  });

  it("never loses or duplicates a row, no matter how many times the top row's disabled 'up' button is clicked", async () => {
    const user = userEvent.setup();
    render(<PickList entries={entries} />);

    // A disabled button fires no click handler at all -- this is the
    // exact click exercise-2 had you make possible by temporarily
    // deleting both the disabled expression and move()'s internal
    // guard. With both intact, clicking here should be a no-op.
    await user.click(screen.getByRole("button", { name: "Move team 118 up" }));

    expect(renderedTeamNames()).toEqual(["Team 118", "Team 254", "Team 1515"]);
  });

  it("picks up a previously-saved order on a fresh render, the same way a page reload would", () => {
    localStorage.setItem("scouting-app:pick-list-order", JSON.stringify(["254", "1515", "118"]));

    render(<PickList entries={entries} />);

    expect(renderedTeamNames()).toEqual(["Team 254", "Team 1515", "Team 118"]);
  });
});
