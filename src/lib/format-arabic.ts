/**
 * Arabic numeral formatting utilities.
 *
 * Eastern Arabic numerals: ٠١٢٣٤٥٦٧٨٩
 * Used in: Egypt, Saudi Arabia, UAE, Iraq, etc.
 */

const WESTERN = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const EASTERN = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/**
 * Replace Western digits (0-9) with Eastern Arabic digits (٠-٩).
 * Safe with any input: strings, numbers, nullish → returns string.
 */
export function toArabicDigits(value: string | number | null | undefined): string {
  const str = String(value ?? "");
  return str.replace(/[0-9]/g, (d) => EASTERN[+d]);
}

/**
 * Format a number using locale-aware formatting.
 * For Arabic, outputs Eastern Arabic digits with proper separators.
 */
export function formatNumber(num: number, locale: string): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : locale).format(num);
}

/**
 * Locale-aware digit conversion for display strings.
 * Only transforms digits when locale is Arabic; otherwise returns as-is.
 */
export function localizeDigits(value: string | number | null | undefined, locale: string): string {
  if (locale !== "ar") return String(value ?? "");
  return toArabicDigits(value);
}
