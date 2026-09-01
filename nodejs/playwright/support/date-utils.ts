/**
 * Return a date in "yyyy-mm-dd HH:MM:SS" string format.
 * @param value The date as Date object.
 * @returns The current date in "yyyy-mm-dd HH:MM:SS" string format.
 */
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


/**
 * Return the test start date in "yyyymmdd-HHMM" string format.
 * @returns The current date in "yyyymmdd-HHMM" string format.
 */
export function generateStartDateTimeLabel() {
  const date = new Date();
  const year = date.getFullYear();  // % 100;
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}${month}${day}-${hours}${minutes}`;
}


/**
 * Return the test start date in "yyyymmdd" string format.
 * @returns The current date in "yyyymmdd" string format.
 */
export function generateStartDateLabel() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}${month}${day}`;
}


/**
 * Return a date in "dd/mm/yyyy" string format.
 * @param value The date as Date object or as number of days to shift from the current date.
 * @returns One of the following:
 *  - The current date if 'value' is null.
 *  - The date specified by 'value' if it is of type 'date'.
 *  - The current date shifted by the number of days indicated by 'value' if it is of type 'number'.
 */
export function formatDate(value: number | Date = null): string {
  let date: Date;
  if (value == null)
    date = new Date();
  else if (typeof value == "number")
    date = getShiftedDate(value);
  else if (value instanceof Date)
    date = value;
  else
    throw new Error("Invalid parameter type");
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${day}/${month}/${year}`;
}


/**
 * Returns a Date instance from a string.
 * @param value The date in "DD/MM/YYYY" string format.
 * @returns The Date instance.
 */
export function dateFromDMY(value: string): Date {
  const [day, month, year] = value.split("/").map(Number);
  return new Date(year, month - 1, day);
}


/**
 * Returns a Date instance from a string.
 * @param value The date in "YYYYMMDD-HHMM" string format.
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
  return getShiftedDate(days);
}


/**
 * Returns the current date shifted by a certain number of days.
 * @param days The shift (positif or negative) to apply to the curent date.
 * @returns The current date incremented/decremented by the given number of days.
 */
export function getShiftedDate(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}


/**
 * Return whether two dates have the same year, month and day.
 * @param date1 The first date to compare.
 * @param date2 The second date to compare. Can be of type Date or string in 'dd/mm/yyyy' format.
 */
export function sameDate(date1: Date, date2: Date | string): boolean {
  if (date2 instanceof Date) {
    return ( 
      date1.getFullYear() == date2.getFullYear() &&
      date1.getMonth() == date2.getMonth() &&
      date1.getDate() == date2.getDate()
    );
  }
  else {
    const year = date1.getFullYear();
    const month = String(date1.getMonth() + 1).padStart(2, '0');
    const day = String(date1.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}` == date2
  }
}
