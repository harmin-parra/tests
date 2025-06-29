const path = require("path");

module.exports = {
  default: {
    format: [
        'progress',
        ['html', '../reporting/report-cucumber/index.html'],
        path.resolve(__dirname, "reporter.js")
    ],
  },
};