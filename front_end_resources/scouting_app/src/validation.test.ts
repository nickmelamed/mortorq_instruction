// validation.test.ts -- the base of the pyramid: validateEntry() is a
// pure function (draft in, ValidationResult out, no DOM, no network, no
// React at all), so testing it needs none of the setup a component test
// does. This is exactly the shape general_programming_resources/
// 07_testing_philosophy means by "many fast, narrow unit tests" -- each
// of these runs in well under a millisecond.

import { describe, expect, it } from "vitest";
import { validateEntry } from "./validation.ts";

const validDraft = {
  teamNumber: "1515",
  matchNumber: "12",
  alliance: "red" as const,
  scouterName: "Ada",
  notes: "  Fast cycles.  ",
};

describe("validateEntry", () => {
  it("accepts a fully-filled-out draft", () => {
    const result = validateEntry(validDraft);
    expect(result.valid).toBe(true);
  });

  it("trims whitespace from every field on success", () => {
    const result = validateEntry(validDraft);
    if (!result.valid) throw new Error("expected a valid result");
    expect(result.entry.notes).toBe("Fast cycles.");
  });

  it("rejects a non-numeric team number", () => {
    const result = validateEntry({ ...validDraft, teamNumber: "fifteen" });
    expect(result.valid).toBe(false);
    if (result.valid) throw new Error("expected an invalid result");
    expect(result.errors.teamNumber).toBeDefined();
  });

  it("rejects a blank scouter name", () => {
    const result = validateEntry({ ...validDraft, scouterName: "   " });
    expect(result.valid).toBe(false);
    if (result.valid) throw new Error("expected an invalid result");
    expect(result.errors.scouterName).toBeDefined();
  });

  it("reports every invalid field at once, not just the first one found", () => {
    const result = validateEntry({ ...validDraft, teamNumber: "", matchNumber: "" });
    expect(result.valid).toBe(false);
    if (result.valid) throw new Error("expected an invalid result");
    expect(Object.keys(result.errors)).toEqual(
      expect.arrayContaining(["teamNumber", "matchNumber"]),
    );
  });
});
