import fs from "node:fs";
import path from "node:path";
import { generateStartDateTimeLabel } from "./date-utils";


export const ENV = process.env.ENV;
export const DELAY = (process.env.CI === 'true') ? 5000 : 5000;
export const HISTORY_LIMIT = 30;
export const KEY_PRESS_DELAY = 50;
export const TIMEOUT_WAIT = (process.env.CI === 'true') ? 10000 : 6000;
export const TIMEOUT_ERROR = (process.env.CI === 'true') ? 10000 : 6000;
export const NG_EVENT = (process.env.CI === 'true') ? 10000 : 10000;
export const TIMEOUT_NETWORK = (process.env.CI === 'true') ? 15000 : 10000;
export const DB_SYNC = (process.env.CI === 'true') ? 10000 : 10000;


// Generate reference date
const FOLDER = 'runtime';
const DATE_FILE = path.join(FOLDER, "date-label.txt");

export const DATE_START = init_date();
export const DATE_LABEL = DATE_START.substring(0, 8);

export function init_date(): string {
  let date;
  if (fs.existsSync(DATE_FILE)) {
    date = fs.readFileSync(DATE_FILE, 'utf8');
  } else {
    date = generateStartDateTimeLabel();
    fs.writeFileSync(DATE_FILE, date, 'utf8');
  }
  return date;
}
