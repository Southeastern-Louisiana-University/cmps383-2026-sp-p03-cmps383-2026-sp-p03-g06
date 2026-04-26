const DAY_INDEX: Record<string, number> = {
  sun: 0,
  sunday: 0,
  mon: 1,
  monday: 1,
  tue: 2,
  tues: 2,
  tuesday: 2,
  wed: 3,
  wednesday: 3,
  thu: 4,
  thur: 4,
  thurs: 4,
  thursday: 4,
  fri: 5,
  friday: 5,
  sat: 6,
  saturday: 6,
};

function parseTimeToMinutes(timeStr: string): number | null {
  const match = timeStr
    .trim()
    .toUpperCase()
    .match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/);

  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const period = match[3];

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

function isTodayInDayRange(dayPart: string, today: number): boolean {
  const cleaned = dayPart.toLowerCase().trim();

  const rangeMatch = cleaned.match(/([a-z]+)\s*-\s*([a-z]+)/i);

  if (rangeMatch) {
    const start = DAY_INDEX[rangeMatch[1]];
    const end = DAY_INDEX[rangeMatch[2]];

    if (start === undefined || end === undefined) return false;

    if (start <= end) {
      return today >= start && today <= end;
    }

    return today >= start || today <= end;
  }

  const singleDayMatch = cleaned.match(/[a-z]+/i);

  if (!singleDayMatch) return false;

  return DAY_INDEX[singleDayMatch[0]] === today;
}

function isCurrentTimeInRange(timeRange: string): boolean {
  const match = timeRange.match(
    /(\d{1,2}(?::\d{2})?\s*(?:AM|PM)?)\s*-\s*(\d{1,2}(?::\d{2})?\s*(?:AM|PM)?)/i,
  );

  if (!match) return false;

  const open = parseTimeToMinutes(match[1]);
  const close = parseTimeToMinutes(match[2]);

  if (open === null || close === null) return false;

  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();

  if (close < open) {
    return current >= open || current < close;
  }

  return current >= open && current < close;
}

export function isLocationOpen(
  hoursOfOperation: string | null | undefined,
): boolean {
  if (!hoursOfOperation) return false;

  const hours = hoursOfOperation.trim();

  if (/closed/i.test(hours) && !hours.includes("|")) {
    return false;
  }

  if (/24 hours|open 24/i.test(hours)) {
    return true;
  }

  const today = new Date().getDay();

  const sections = hours.split("|").map((section) => section.trim());

  for (const section of sections) {
    const firstColonIndex = section.indexOf(":");

    if (firstColonIndex === -1) continue;

    const dayPart = section.substring(0, firstColonIndex).trim();
    const timePart = section.substring(firstColonIndex + 1).trim();

    if (!dayPart || !timePart) continue;

    if (!isTodayInDayRange(dayPart, today)) continue;

    if (/closed/i.test(timePart)) {
      return false;
    }

    return isCurrentTimeInRange(timePart);
  }

  return false; // ✅ fallback if nothing matched
}
