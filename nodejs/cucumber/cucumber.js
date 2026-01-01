module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: ["steps/**/*.ts", "support/**/*.ts"],
    format: [
      "html:../../reporting/report-cucumber/index.html",
      "allure-cucumberjs/reporter"
    ],
    formatOptions: {
      resultsDir: "../../reporting/allure-results/nodejs",
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
