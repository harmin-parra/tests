export function formatDateHour(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function generateDateLabel() {
  const d = new Date();
  const year = d.getFullYear() % 100;
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${year}${month}${day}-${hours}${minutes}`;
}

/**
 * Returns the "DD/MM/YYYY" string representation of a Date instance.
 * @param value The Date instance.
 * @returns The date in "DD/MM/YYYY" format.
 */
export function dateToDMY(date: Date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${day}/${month}/${year}`;
}

/**
 * Returns a Date instance from a string.
 * @param value The date in "DD/MM/YYYY" format.
 * @returns The Date instance.
 */
export function dateFromDMY(value: string): Date {
  const [day, month, year] = value.split("/").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Returns a Date instance from a string.
 * @param value The date in "YYYYMMDD-HHMM" format.
 * @returns The Date instance.
 */
export function dateFromYMD_HM(value: string) {
  const [datePart, timePart] = value.split('-');

  const year = parseInt(datePart.substring(0, 4), 10);
  const month = parseInt(datePart.substring(4, 6), 10);
  const day = parseInt(datePart.substring(6, 8), 10);
  const hour = parseInt(timePart.substring(0, 2), 10);
  const minute = parseInt(timePart.substring(2, 4), 10);

  return new Date(year, month - 1, day, hour, minute);
}

/**
 * Returns a future date.
 * @param days The number of days in the future.
 * @returns The current date incremented by the given number of days.
 */
export function getFutureDate(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);;
}

