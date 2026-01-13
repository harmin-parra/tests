import { test } from '@playwright/test';


export class Junit {

  static async annotation_result() {
    test.info().annotations.push({
      type: 'result_comment',
      description: "Test executed with Playwright"
    });
  }

  static async annotation_case_id(caseid: number | string) {
    test.info().annotations.push({
      type: 'case_id',
      description: caseid.toString()
    });
  }

  static async annotation_attachment(filepath: string) {
    test.info().annotations.push({
      type: 'attachment',
      description: filepath
    });
  }

  static async annotation_issues(issues: string[]) {
    if (issues.length > 0) {
      test.info().annotations.push({
        type: 'issues',
        description: issues.join(',')
      });
    }
  }
}
