// Date helpers. All calendar dates are handled as "YYYY-MM-DD" strings
// (clinic-local time), which keeps them comparable and sortable.

export function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayISO(): string {
  return toISO(new Date());
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDaysISO(iso: string, n: number): string {
  const d = parseISO(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
}

export function weekdayIndex(iso: string): number {
  return parseISO(iso).getDay(); // 0 = Sunday
}

export const WEEKDAYS_SHORT = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
export const WEEKDAYS_LONG = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];
export const MONTHS_SHORT = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
export const MONTHS_LONG = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

export function humanLong(iso: string): string {
  const d = parseISO(iso);
  return `${WEEKDAYS_LONG[d.getDay()]}, ${MONTHS_LONG[d.getMonth()]} ${d.getDate()}`;
}

export function humanShort(iso: string): string {
  const d = parseISO(iso);
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
}

export function dayNum(iso: string): string {
  return iso.slice(8, 10);
}

export function weekdayShort(iso: string): string {
  return WEEKDAYS_SHORT[parseISO(iso).getDay()];
}

export function minutesOf(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function hhmm(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function rangesOverlap(aS: number, aE: number, bS: number, bE: number): boolean {
  return aS < bE && bS < aE;
}

export function periodOf(t: string): "MORNING" | "AFTERNOON" | "EVENING" {
  const m = minutesOf(t);
  if (m < 12 * 60) return "MORNING";
  if (m < 17 * 60) return "AFTERNOON";
  return "EVENING";
}

export function ageLabelFromDates(birthDate: string | null): string | null {
  if (!birthDate) return null;
  const now = new Date();
  const b = parseISO(birthDate);
  const months =
    (now.getFullYear() - b.getFullYear()) * 12 + (now.getMonth() - b.getMonth());
  if (months < 12) return `${Math.max(months, 1)} MO`;
  const years = Math.floor(months / 12);
  return `${years} YR${years > 1 ? "S" : ""}`;
}
