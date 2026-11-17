import { describe, expect, it } from "vitest";
import { formatPhp, parsePhp, sumCentavos } from "./money";

describe("formatPhp", () => {
  it("formats pesos with separators and two decimals", () => {
    expect(formatPhp(0)).toBe("₱0.00");
    expect(formatPhp(5)).toBe("₱0.05");
    expect(formatPhp(123_456)).toBe("₱1,234.56");
    expect(formatPhp(1_234_567_890)).toBe("₱12,345,678.90");
  });

  it("uses a real minus sign for negatives", () => {
    expect(formatPhp(-381_240)).toBe("−₱3,812.40");
  });

  it("refuses fractional centavos instead of rounding silently", () => {
    expect(() => formatPhp(10.5)).toThrow(RangeError);
    expect(() => formatPhp(Number.NaN)).toThrow(RangeError);
  });
});

describe("parsePhp", () => {
  it("parses typed amounts into integer centavos", () => {
    expect(parsePhp("1,250.50")).toBe(125_050);
    expect(parsePhp("₱1,250")).toBe(125_000);
    expect(parsePhp("0.5")).toBe(50);
    expect(parsePhp("−12.34")).toBe(-1_234);
  });

  it("rejects anything that is not money", () => {
    expect(parsePhp("")).toBeNull();
    expect(parsePhp("12.345")).toBeNull();
    expect(parsePhp("abc")).toBeNull();
    expect(parsePhp("1e3")).toBeNull();
  });

  it("round-trips with formatPhp", () => {
    for (const value of [0, 1, 99, 100, 123_456, -9_999_999]) {
      expect(parsePhp(formatPhp(value))).toBe(value);
    }
  });
});

describe("sumCentavos", () => {
  it("adds exactly, with no float drift", () => {
    expect(sumCentavos([10, 20, 30])).toBe(60);
    expect(sumCentavos(Array.from({ length: 1000 }, () => 10))).toBe(10_000);
  });
});
