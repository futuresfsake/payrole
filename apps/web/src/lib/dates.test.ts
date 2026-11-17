import { describe, expect, it } from "vitest";
import { daysUntil, formatDate, formatDateTime } from "./dates";

describe("dates in Asia/Manila", () => {
  it("formats a UTC instant as Manila time", () => {
    // 23:30 UTC on 14 Nov is 07:30 on 15 Nov in Manila.
    expect(formatDate("2026-11-14T23:30:00Z")).toBe("15 Nov 2026");
    expect(formatDateTime("2026-11-14T23:30:00Z")).toContain("07:30");
  });

  it("counts whole calendar days in Manila", () => {
    const now = new Date("2026-11-17T01:00:00Z"); // 09:00 Manila, 17 Nov
    expect(daysUntil("2026-12-04T00:00:00+08:00", now)).toBe(17);
    expect(daysUntil("2026-11-17T23:00:00+08:00", now)).toBe(0);
    expect(daysUntil("2026-11-10T08:00:00+08:00", now)).toBe(-7);
  });

  it("does not shift a late-evening Manila date to the next day", () => {
    const now = new Date("2026-11-17T15:30:00Z"); // 23:30 Manila, still 17 Nov
    expect(daysUntil("2026-11-18T00:30:00+08:00", now)).toBe(1);
  });
});
