/**
 * Counts working days between two ISO dates, inclusive, Monday to Friday.
 * Company schedules and holidays are applied by the real API; this is the same rule the mock uses,
 * so the form preview and the server agree.
 */
export function countLeaveDays(startIso: string, endIso: string): number {
  const start = Date.parse(`${startIso}T00:00:00Z`);
  const end = Date.parse(`${endIso}T00:00:00Z`);
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return 0;
  let days = 0;
  for (let time = start; time <= end; time += 86_400_000) {
    const weekday = new Date(time).getUTCDay();
    if (weekday !== 0 && weekday !== 6) days += 1;
  }
  return days;
}
