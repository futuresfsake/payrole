/**
 * Money is integer centavos. Rates and factors are decimal strings elsewhere; they never go through here.
 * One formatter, one parser, no floats in arithmetic.
 */
const MINUS = "−";

function assertCentavos(value: number): void {
  if (!Number.isSafeInteger(value)) {
    throw new RangeError(`Money must be an integer number of centavos, got ${value}`);
  }
}

export function formatPhp(centavos: number): string {
  assertCentavos(centavos);
  const negative = centavos < 0;
  const abs = Math.abs(centavos);
  const pesos = Math.floor(abs / 100);
  const cents = abs % 100;
  const whole = pesos.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${negative ? MINUS : ""}₱${whole}.${cents.toString().padStart(2, "0")}`;
}

/** Parses "1,234.50", "1234.5" or "₱1,234" into centavos. Returns null for anything else. */
export function parsePhp(input: string): number | null {
  const cleaned = input.replace(/[₱,\s]/g, "").replace(MINUS, "-");
  const match = /^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(cleaned);
  if (!match) return null;
  const [, sign, pesos, cents = ""] = match;
  const total = Number(pesos) * 100 + Number(cents.padEnd(2, "0"));
  if (!Number.isSafeInteger(total)) return null;
  return sign === "-" ? -total : total;
}

export function sumCentavos(values: readonly number[]): number {
  return values.reduce((total, value) => {
    assertCentavos(value);
    return total + value;
  }, 0);
}
