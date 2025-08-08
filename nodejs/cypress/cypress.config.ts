import { defineConfig } from 'cypress'
import { allureCypress } from 'allure-cypress/reporter';

export default defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  video: false,
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Cypress Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    reportDir: "../../reporting/report-cypress",
  },
  e2e: {
    experimentalStudio: true,
    supportFile: 'support/e2e.{js,jsx,ts,tsx}',
    specPattern: 'tests/**/*.cy.{js,jsx,ts,tsx}',
    fixturesFolder: 'fixtures',
    setupNodeEvents(on, config) {
      allureCypress(on, {
        resultsDir: "../../reporting/allure-results/nodejs",
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
      });
      require('cypress-mochawesome-reporter/plugin')(on);
    },
  },
});
