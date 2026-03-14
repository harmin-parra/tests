import path from 'node:path';


export const RUNTIME_FOLDER = 'runtime';
export const storagePath = path.join(RUNTIME_FOLDER, "storageState.json");
export const DATE_FILE = path.join(RUNTIME_FOLDER, "date-label.txt");
export const COUNTER_FILE = path.join(RUNTIME_FOLDER, "next-id.txt");
export const COVERAGE_RESULTS_FOLDER = path.join('reports', 'coverage-results');
export const COVERAGE_REPORT_FOLDER = path.join('reports', 'coverage-report');
