module.exports = {
  default: {
    paths: ["features/**/*.feature"],
    requireModule: ["ts-node/register"],
    require: ["steps/**/*.ts"],
    format: [
      "html:../../reporting/report-cucumber/index.html",
      "allure-cucumberjs/reporter"
    ],
    formatOptions: {
      resultsDir: "../../reporting/allure-results/nodejs"
    }
  }
};
