function getOffsetMinutes(date: Date, timezone: string): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "shortOffset",
  });

  const parts = formatter.formatToParts(date);
  const offsetToken = parts.find((part) => part.type === "timeZoneName")?.value;

  if (offsetToken) {
    const match = offsetToken.match(/GMT([+-])(\d{2})(?::?(\d{2}))?/);
    if (match) {
      const sign = match[1] === "-" ? -1 : 1;
      const hours = parseInt(match[2], 10);
      const minutes = match[3] ? parseInt(match[3], 10) : 0;
      return sign * (hours * 60 + minutes);
    }
  }

  // Fallback caso o formato acima não esteja disponível
  const localeDate = new Date(date.toLocaleString("en-US", { timeZone: timezone }));
  const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  return Math.round((localeDate.getTime() - utcDate.getTime()) / 60000);
}

export function getDayRangeInTimezone(
  timezone: string,
  referenceDate: Date = new Date(),
): { start: Date; end: Date } {
  const dateStr = referenceDate.toLocaleDateString("en-CA", { timeZone: timezone });
  const [year, month, day] = dateStr.split("-").map(Number);

  const startBase = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  const endBase = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

  const startOffset = getOffsetMinutes(startBase, timezone);
  const endOffset = getOffsetMinutes(endBase, timezone);

  const startUTC = new Date(startBase.getTime() - startOffset * 60_000);
  const endUTC = new Date(endBase.getTime() - endOffset * 60_000);

  return { start: startUTC, end: endUTC };
}


