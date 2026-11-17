/** All dates are shown in Asia/Manila (UTC+8, no daylight saving). One place formats them. */
const ZONE = "Asia/Manila";

const dateFormat = new Intl.DateTimeFormat("en-GB", { timeZone: ZONE, day: "numeric", month: "short", year: "numeric" });
const timeFormat = new Intl.DateTimeFormat("en-GB", { timeZone: ZONE, hour: "2-digit", minute: "2-digit", hour12: false });
const dayKey = new Intl.DateTimeFormat("en-CA", { timeZone: ZONE, year: "numeric", month: "2-digit", day: "2-digit" });

export function formatDate(iso: string): string {
  return dateFormat.format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return `${dateFormat.format(date)}, ${timeFormat.format(date)}`;
}

/** Whole calendar days from `now` to `iso`, counted in Manila. Negative when `iso` is in the past. */
export function daysUntil(iso: string, now: Date = new Date()): number {
  const target = Date.parse(`${dayKey.format(new Date(iso))}T00:00:00Z`);
  const today = Date.parse(`${dayKey.format(now)}T00:00:00Z`);
  return Math.round((target - today) / 86_400_000);
}
