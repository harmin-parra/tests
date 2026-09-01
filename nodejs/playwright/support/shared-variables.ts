import fs from 'node:fs';
import path from 'node:path';
import { DATE_START } from './constants';


export const RUNTIME_FOLDER = 'runtime';
export const storagePath = path.join(RUNTIME_FOLDER, "storageState.json");
export const DATE_FILE = path.join(RUNTIME_FOLDER, "date-label.txt");
export const COUNTER_FILE = path.join(RUNTIME_FOLDER, "next-id.txt");
export const COVERAGE_RESULTS_FOLDER = path.join('reports', 'coverage-results');
export const COVERAGE_REPORT_FOLDER = path.join('reports', 'coverage-report');


export function nextId(): number {
  let current;
  if (!fs.existsSync(COUNTER_FILE)) {
    fs.writeFileSync(COUNTER_FILE, '1', 'utf8');
    current = 1;
  } else {
    const raw = fs.readFileSync(COUNTER_FILE, "utf8").trim();
    current = parseInt(raw, 10);
  }
  const next = current + 1;
  fs.writeFileSync(COUNTER_FILE, String(next));
  return current;
}

export function getNextSuffix(): string {
  return DATE_START + '-' + nextId();
}
