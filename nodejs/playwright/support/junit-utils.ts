import { test } from '@playwright/test';


export class Junit {

  static async annotation_result() {
    test.info().annotations.push({
      type: 'comment',
      description: "Test executed with Playwright"
    });
  }

  static async annotation_case_id(caseid: number | string) {
    test.info().annotations.push({
      type: 'case_id',
      description: caseid.toString()
    });
  }

  static async annotation_image(filePath: string) {
    test.info().annotations.push({
      type: 'image',
      description: filePath
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

  static async annotation_video(filePath: string) {
    test.info().annotations.push({
      type: 'video',
      description: filePath
    });
  }

  static async annotation_pdf(filePath: string) {
    test.info().annotations.push({
      type: 'pdf',
      description: filePath
    });
  }

  static async annotation_history(history: string[]) {
    let passed = 0;
    let total = 0;
    let result = [];
    for (const item of history) {
      if (item == "passed")
        passed++;
      if (item != null && item != '') {
        total++;
        result.push(item);
      }
    }
    test.info().annotations.push({
      type: `history_trend`,
      description: total != 0 ? String(Math.round(100 * passed / total)) : '0'
    });
    test.info().annotations.push({
      type: `history_results`,
      description: result.join(", ")
    });
  }

}
