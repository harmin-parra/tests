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

  static async annotation_history(folder: string) {
    test.info().annotations.push({
      type: `history_folder`,
      description: folder
    });
  }

}


function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map(word => word[0])
    .join('')
    .toUpperCase();
}
