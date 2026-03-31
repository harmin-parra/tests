import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
  // globalSetup: './support/global-setup.ts',
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  outputDir: 'reports/playwright-results',
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'reports/report-playwright' }],
    ['line'],
    ['junit', { 
      outputFile: 'reports/report-junit/report.xml',
      embedAnnotationsAsProperties: true
    }],
    ['allure-playwright', {
      detail: false,
      resultsDir: 'reports/allure-results',
      suiteTitle: true,
      links: {
        issue: {
          nameTemplate: "JIRA-%s",
          urlTemplate: "https://issues.example.com/%s",
        },
        tms: {
          nameTemplate: "TEST-%s",
          urlTemplate: "https://tms.example.com/%s",
        }
      }
    }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    // baseURL: 'http://127.0.0.1:3000',
    // storageState: storagePath,
    viewport: { width: 1440, height: 900 },  // { width: 1920, height: 1080 },
    launchOptions: {
      args: ['--window-size=1440,900']
    },
    trace: 'on-first-retry',
    video: {
      mode: 'on',
    },
    /*
    contextOptions: {
      recordVideo: {
        dir: 'test-results',
      }
    }
    */
  },

  /* Configure projects for major browsers */
  projects: [
    { name: 'chromium' },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'chrome', use: { browserName: 'chromium', channel: 'chrome' } },
    { name: 'msedge', use: { browserName: 'chromium', channel: 'msedge' } }
  ],
});
