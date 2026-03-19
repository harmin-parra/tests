module.exports = {
  default: {
    paths: ["features/**/*.feature"],
    requireModule: ["ts-node/register"],
    require: ["steps/**/*.ts", "support/**/*.ts"],
    format: [
      "html:reports/report-cucumber/index.html",
      "allure-cucumberjs/reporter"
    ],
    formatOptions: {
      resultsDir: "reports/allure-results",
      links: {
        issue: {
          pattern: [/@issue:(.*)/],
          urlTemplate: "https://issues.example.com/JIRA-%s",
          nameTemplate: "JIRA-%s",
        },
        tms: {
          pattern: [/@tms:(.*)/],
          urlTemplate: "https://tms.example.com/TEST-%s",
          nameTemplate: "TEST-%s",
        }
      }
    }
  }
};
