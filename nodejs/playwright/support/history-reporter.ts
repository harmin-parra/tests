import fs from "node:fs";
import path from "node:path";
import type { FullConfig, Reporter, Suite, TestCase, TestResult } from "@playwright/test/reporter";
import { getCaseid } from "./utils";
import { formatDateHour } from "./date-utils";
import { ENV, HISTORY_LIMIT } from "./constants";


interface TestExecutionRecord {
  date: string,
  status: string,
}

interface TestRecord {
  id: number;
  title: string,
  environment: string,
  trend: number,
  history: TestExecutionRecord[],
}

interface SuiteExecutionRecord {
  date: string,
  total: number,
  passed: number,
  failed: number,
  skipped: number,
  other: number,
}

interface SuiteRecord {
  environment: string,
  history: SuiteExecutionRecord[],
}

const allowed = new Set(["passed", "failed", "skipped"]);


export default class HistoryReporter implements Reporter {

  private outputFolder: string;
  private historyFolder: string;
  private limit: number;
  private results: SuiteExecutionRecord;
  
  constructor(options?: { historyFolder?: string, outputFolder?: string, limit?: number }) {
    this.outputFolder = options?.outputFolder ?? './';
    this.historyFolder = options?.historyFolder ?? '/tmp/history';
    this.limit = options?.limit ?? HISTORY_LIMIT;
    this.results = {
      date: formatDateHour(new Date()),
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      other: 0,      
    };
  }

  onBegin(config: FullConfig, suite: Suite): void {
    if (process.env.ENV == null || process.env.HISTORY != "true")
      return;
    fs.rmSync(this.outputFolder, { recursive: true, force: true });
    fs.mkdirSync(this.outputFolder, { recursive: true });
  }

  onTestEnd(test: TestCase, result: TestResult) {
    if (process.env.ENV == null || process.env.HISTORY != "true")
      return;

    switch (result.status) {
      case 'passed':
        this.results.passed++;
        break;
      case 'failed':
        this.results.failed++;
        break;
      case 'skipped':
        this.results.skipped++;
        break;
      default:
        this.results.other++;
        break;
    }

    const filename = `${ENV}.json`;
    const id = getCaseid(test.title);
    const subfolderReport = path.join(this.outputFolder, id);
    const subfolderHistory = path.join(this.historyFolder, id);
    if (id == '0')
      return;
    // Read test record
    let raw_record;
    try {
      raw_record = fs.readFileSync(path.join(subfolderHistory, filename), 'utf8');
    } catch (error) {
      raw_record = '';
      fs.mkdirSync(subfolderHistory, { recursive: true });
    }
    let json_record: TestRecord = ['', null].includes(raw_record) ? {} : JSON.parse(raw_record);
    let json_history: TestExecutionRecord[] = json_record?.history ?? [];
    // Insert test result in test history
    const status = allowed.has(result.status) ? result.status : "other";
    const date = formatDateHour(result.startTime);
    // json_history = [{date: date, status: status}, ...json_history].slice(0, this.limit).reverse();
    json_history = [...json_history, { date: date, status: status }].slice(-this.limit);
    // Write/update global test record file
    const trend = calculateTrend(json_history);
    json_record = {
      id: Number(id),
      title: test.title,
      environment: ENV,
      trend: trend,
      history: json_history,
    };
    raw_record = JSON.stringify(json_record, null, 2);
    fs.writeFileSync(path.join(subfolderHistory, filename), raw_record, "utf-8");
    // Write junit-report test history file
    try {
      fs.mkdirSync(subfolderReport);
    } catch (err) {
      if (err instanceof Error && 'code' in err && err.code === 'EEXIST')
        console.warn(`Test ID ${id} is duplicated`);
    }
    fs.writeFileSync(path.join(subfolderReport, "trend.xml"), `<trend>${trend}</trend>`, "utf-8");
    fs.writeFileSync(path.join(subfolderReport, "history.json"), raw_record, "utf-8");
  }

  onEnd() {
    if (process.env.ENV == null || process.env.HISTORY != "true")
      return;
    const subfolderReport = path.join(this.outputFolder, 'suite');
    const subfolderHistory = path.join(this.historyFolder, "suites");
    // Update total count
    this.results.total = this.results.passed + this.results.failed + this.results.skipped + this.results.other;
    // Read run record
    let raw_record;
    try {
      raw_record = fs.readFileSync(path.join(subfolderHistory, `${ENV}.json`), 'utf8');
    } catch (error) {
      raw_record = '';
      fs.mkdirSync(subfolderHistory, { recursive: true });
    }
    // Update run record
    let json_record: SuiteRecord = ['', null].includes(raw_record) ? {} : JSON.parse(raw_record);
    let json_history: SuiteExecutionRecord[] = json_record?.history ?? [];
    // json_history = [this.results, ...json_history].slice(0, this.limit).reverse();
    json_history = [...json_history, this.results].slice(-this.limit);
    json_record.environment = ENV;
    json_record.history = json_history;
    // Write/update run record
    raw_record = JSON.stringify(json_record, null, 2);
    fs.writeFileSync(path.join(subfolderHistory, `${ENV}.json`), raw_record, "utf-8");
    fs.mkdirSync(subfolderReport);
    fs.writeFileSync(path.join(subfolderReport, "history.json"), raw_record, "utf-8");
  }

}

/**
 * Calculate the success rate in a test history
 * @param result The results history.
 * @returns The success rate.
 */
function calculateTrend(results: TestExecutionRecord[]): number {
  let passed= 0;
  let skipped = 0;
  let failed = 0;
  let other = 0;
  let total = 0;
  for (const item of results) {
    switch(item.status) {
      case 'passed': passed++; break;
      case 'failed': failed++; break;
      case 'skipped': skipped++; break;
      default: other++;
    }
    total++;
  }
  return total != 0 ? Math.round(100 * passed / total) : 0;
}
