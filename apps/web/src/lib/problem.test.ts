import { describe, expect, it } from "vitest";
import { REASON_MESSAGES, describeReason, type ReasonCode } from "./problem";

describe("reason messages", () => {
  it("has a plain-words message for every reason code", () => {
    for (const [code, message] of Object.entries(REASON_MESSAGES)) {
      expect(message.title.length, code).toBeGreaterThan(5);
      expect(message.body.length, code).toBeGreaterThan(20);
    }
  });

  it("never falls back to a bare 'Access denied'", () => {
    for (const message of Object.values(REASON_MESSAGES)) {
      expect(`${message.title} ${message.body}`.toLowerCase()).not.toContain("access denied");
    }
  });

  it("marks only SoD-5 and SoD-6 as overridable", () => {
    const overridable = (Object.keys(REASON_MESSAGES) as ReasonCode[]).filter((code) => describeReason(code).overridable);
    expect(overridable.sort()).toEqual(["SOD_5", "SOD_6"]);
  });

  it("names the rule in every SoD message", () => {
    for (const n of [1, 2, 3, 4, 5, 6, 7]) {
      expect(describeReason(`SOD_${n}` as ReasonCode).body).toContain(`SoD-${n}`);
    }
  });
});
