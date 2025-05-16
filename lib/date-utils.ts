import { parse, format } from "date-fns"

/**
 * Parse a raw date value (string in yy-MM-dd / yyyy-MM-dd or Date object)
 * and return a formatted string like "Apr 24, 2025".
 *
 * Returns empty string on failure.
 */
export function formatDisplayDate(raw: unknown): string {
  if (!raw) return ""

  try {
    let date: Date | undefined

    if (raw instanceof Date) {
      date = raw
    } else if (typeof raw === "string") {
      const trimmed = raw.trim()

      if (/^\d{2}-\d{2}-\d{2}$/.test(trimmed)) {
        // yy-MM-dd e.g., 24-05-13
        date = parse(trimmed, "yy-MM-dd", new Date())
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        // yyyy-MM-dd e.g., 2025-05-13
        date = parse(trimmed, "yyyy-MM-dd", new Date())
      } else {
        // Attempt to parse with Date constructor fallback
        const maybe = new Date(trimmed)
        if (!isNaN(maybe.getTime())) {
          date = maybe
        }
      }
    }

    if (date && !isNaN(date.getTime())) {
      return format(date, "MMM d, yyyy")
    }
  } catch (err) {
    console.warn("formatDisplayDate: failed to parse", raw, err)
  }

  return ""
} 