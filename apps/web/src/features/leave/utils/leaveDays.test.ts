import { describe, expect, it } from "vitest";
import { countLeaveDays } from "./leaveDays";

describe("countLeaveDays", () => {
  it("counts weekdays inclusive", () => {
    expect(countLeaveDays("2026-12-22", "2026-12-24")).toBe(3); // Tue to Thu
    expect(countLeaveDays("2026-11-24", "2026-11-24")).toBe(1);
  });

  it("skips weekends", () => {
    expect(countLeaveDays("2026-12-18", "2026-12-21")).toBe(2); // Fri to Mon
    expect(countLeaveDays("2026-12-19", "2026-12-20")).toBe(0); // Sat and Sun
  });

  it("returns 0 for an end date before the start or for junk", () => {
    expect(countLeaveDays("2026-12-24", "2026-12-22")).toBe(0);
    expect(countLeaveDays("", "2026-12-22")).toBe(0);
  });
});
