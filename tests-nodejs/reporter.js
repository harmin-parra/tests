const { CucumberJSAllureFormatter, AllureRuntime } = require("allure-cucumberjs");

function Reporter(options) {
  return new CucumberJSAllureFormatter(
    options,
    new AllureRuntime({ resultsDir: "../reporting/allure-results/nodejs" }),
    {}
  );
}
Reporter.prototype = Object.create(CucumberJSAllureFormatter.prototype);
Reporter.prototype.constructor = Reporter;

exports.default = Reporter;
