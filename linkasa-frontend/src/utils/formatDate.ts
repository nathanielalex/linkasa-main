export function formatDate(
  isoDate: string,
  locale: string = "en-US",
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }
): string {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "Invalid Date";

  return new Intl.DateTimeFormat(locale, options).format(date);
}
