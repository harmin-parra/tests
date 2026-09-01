import fs from "node:fs";
import path from "node:path";
import type { Reporter, TestCase, TestResult } from "@playwright/test/reporter";
import { ENV, DATE_LABEL } from "./constants";
import { getCaseid } from "./utils";


interface CompactResult {
  id: string;
  title: string,
  status: string;
}

export default class JsonReporter implements Reporter{

  private results: CompactResult[];
  private outputFile: string;

  constructor(options?: { outputFile?: string }) {
    this.results = [];
    this.outputFile = options?.outputFile ?? "json-report.json";
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const id = getCaseid(test.title);
    if (id != '0')
      this.results.push({
        id: getCaseid(test.title),
        title: test.title,
        status: result.status,
      });
  }

  onEnd() {
    const report = {
      environment: ENV,
      date: DATE_LABEL,
      summary: {
        total: this.results.length,
        passed: this.results.filter(r => r.status === 'passed').length,
        failed: this.results.filter(r => r.status === 'failed').length,
        skipped: this.results.filter(r => r.status === 'skipped').length,
        other: 0,
      },
      tests: this.results,
    };
    report.summary.other = report.summary.total - (report.summary.passed + report.summary.failed + report.summary.skipped);
    fs.mkdirSync(path.dirname(this.outputFile), { recursive: true });
    fs.writeFileSync(
      this.outputFile,
      JSON.stringify(report, null, 2)
    );
  }
}
