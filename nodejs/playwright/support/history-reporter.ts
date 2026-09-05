import fs from "node:fs";
import path from "node:path";
import type { FullConfig, Reporter, Suite, TestCase, TestResult } from "@playwright/test/reporter";
import { getCaseid } from "./utils";
import { formatDateHour } from "./date-utils";
import { Junit } from "./junit-utils";
import { HISTORY_LIMIT } from "./constants";


interface ExecutionRecord {
  date: string,
  status: string,
}

interface HistoryRecord {
  id: number;
  title: string,
  environment: string,
  trend: number,
  history: ExecutionRecord[],
}

const allowed = new Set(["passed", "failed", "skipped"]);


export default class HistoryReporter implements Reporter {

  private outputFolder: string;
  private historyFolder: string;
  private limit: number;

  constructor(options?: { historyFolder?: string, outputFolder?: string, limit?: number }) {
    this.outputFolder = options?.outputFolder ?? './';
    this.historyFolder = options?.historyFolder ?? '/tmp/history';
    this.limit = options?.limit ?? HISTORY_LIMIT;
  }

  onBegin(config: FullConfig, suite: Suite): void {
    if (process.env.ENV == null || process.env.HISTORY == null)
      return;
    fs.mkdirSync(this.outputFolder, { recursive: true });
  }

  onTestEnd(test: TestCase, result: TestResult) {
    if (process.env.ENV == null || process.env.HISTORY == null)
      return;
    const env = process.env.ENV;
    const filename = `${env}.json`;
    const id = getCaseid(test.title);
    if (id == '0')
      return;
    // Read history record
    let raw_record;
    try {
      raw_record = fs.readFileSync(path.join(this.historyFolder, id, filename), 'utf8');
    } catch (error) {
      raw_record = '';
    }
    let json_record: HistoryRecord = ['', null].includes(raw_record) ? {} : JSON.parse(raw_record);
    let json_history: ExecutionRecord[] = json_record?.history ?? [];
    // Build and insert history item
    const reportFolder = path.join(this.outputFolder, id);
    const status = allowed.has(result.status) ? result.status : "other";
    const date = formatDateHour(result.startTime);
    json_history = [{date: date, status: status}, ...json_history].slice(0, this.limit);
    const trend = calculateTrend(json_history);
    json_record = {
      id: Number(id),
      title: test.title,
      environment: env,
      history: json_history,
      trend: trend,
    };
    // Write/update files
    raw_record = JSON.stringify(json_record, null, 2);
    fs.mkdirSync(path.join(this.historyFolder, id), { recursive: true });
    fs.writeFileSync(path.join(this.historyFolder, id, filename), raw_record, "utf-8");
    fs.mkdirSync(reportFolder, { recursive: true });
    fs.writeFileSync(path.join(reportFolder, "trend.xml"), `<trend>${trend}</trend>`, "utf-8");
    fs.writeFileSync(path.join(reportFolder, "history.json"), raw_record, "utf-8");
    Junit.annotation_history(reportFolder);
  }

}

/**
 * Calculate the success rate in a test history
 * @param result The results history.
 * @returns The success rate.
 */
function calculateTrend(results: ExecutionRecord[]): number {
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
