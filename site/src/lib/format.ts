// Deterministic, locale-pinned formatting. Everything renders in UTC so
// server output is stable regardless of host timezone.

/** "2026-06-15" or a Date → "June 15, 2026" (UTC). */
export function formatDateUtc(value: string | Date): string {
  const date =
    typeof value === "string" ? new Date(`${value}T00:00:00Z`) : value;
  return date.toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Timestamp → "June 15, 2026, 5:00 PM UTC". */
export function formatDateTimeUtc(value: Date): string {
  const formatted = value.toLocaleString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  return `${formatted} UTC`;
}

/** 0 → "Module 0", 3.5 → "Module 3.5". */
export function moduleLabel(number: number): string {
  return `Module ${number}`;
}

/** 45 → "45 min", 215 → "3 hr 35 min". */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`;
}
