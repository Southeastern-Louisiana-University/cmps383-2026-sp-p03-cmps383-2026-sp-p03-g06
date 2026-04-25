/**
 * Parses hours of operation string and determines if location is currently open
 * Expected format: "9:00 AM - 5:00 PM" or similar time ranges
 */

interface HoursRange {
  open: Date;
  close: Date;
}

function parseTimeString(timeStr: string): Date | null {
  // Try parsing common formats like "9:00 AM", "9:00", "09:00 AM"
  const cleanedTime = timeStr.trim().toUpperCase();

  // Match time with optional AM/PM
  const match = cleanedTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3]?.toUpperCase();

  // Handle 12-hour format
  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function parseHoursRange(hoursStr: string): HoursRange | null {
  // Split by " - " or "-" to get open and close times
  const parts = hoursStr.split(/\s*-\s*/);
  if (parts.length !== 2) return null;

  const openTime = parseTimeString(parts[0]);
  const closeTime = parseTimeString(parts[1]);

  if (!openTime || !closeTime) return null;

  return { open: openTime, close: closeTime };
}

export function isLocationOpen(
  hoursOfOperation: string | null | undefined,
): boolean {
  if (!hoursOfOperation) return false;

  const hoursRange = parseHoursRange(hoursOfOperation);
  if (!hoursRange) return false;

  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeInMinutes = currentHours * 60 + currentMinutes;

  const openTimeInMinutes =
    hoursRange.open.getHours() * 60 + hoursRange.open.getMinutes();
  const closeTimeInMinutes =
    hoursRange.close.getHours() * 60 + hoursRange.close.getMinutes();

  // Handle cases where closing time is after midnight (e.g., 10 AM - 2 AM)
  if (closeTimeInMinutes < openTimeInMinutes) {
    // Location is open past midnight
    return (
      currentTimeInMinutes >= openTimeInMinutes ||
      currentTimeInMinutes < closeTimeInMinutes
    );
  }

  return (
    currentTimeInMinutes >= openTimeInMinutes &&
    currentTimeInMinutes < closeTimeInMinutes
  );
}

export function getLocationStatus(
  hoursOfOperation: string | null | undefined,
): "open" | "closed" {
  return isLocationOpen(hoursOfOperation) ? "open" : "closed";
}
