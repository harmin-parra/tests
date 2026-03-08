import fs from 'node:fs';
import path from 'node:path';


export const RUNTIME_FOLDER = 'runtime';
export const storagePath = path.join(RUNTIME_FOLDER, "storageState.json");
export const DATE_FILE = path.join(RUNTIME_FOLDER, "date-label.txt");
export const COUNTER_FILE = path.join(RUNTIME_FOLDER, "next-id.txt");
export const COVERAGE_RAW_FOLDER = path.join(RUNTIME_FOLDER, 'coverage');
export const COVERAGE_REPORT_FOLDER = path.join('reports', 'coverage');
