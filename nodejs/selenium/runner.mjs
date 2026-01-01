import { Status } from "allure-js-commons";
import { glob } from "glob";
import Mocha from "mocha";
import * as os from "node:os";

const mocha = new Mocha({
  reporter: "allure-mocha",
  extension: "ts",
  reporterOptions: {
    resultsDir: "../../reporting/allure-results/nodejs",
    extraReporters: "spec",
    links: {
      issue: {
        nameTemplate: "JIRA-%s",
        urlTemplate: "https://issues.example.com/JIRA-%s",
      },
      tms: {
        nameTemplate: "TEST-%s",
        urlTemplate: "https://tms.example.com/TEST-%s",
      }
    },
    /*
    environmentInfo: {
      os_platform: os.platform(),
      os_release: os.release(),
      os_version: os.version(),
      node_version: process.version,
    },
    */
  },
});

glob.sync("tests/**/*.spec.ts").forEach((file) => mocha.addFile(file));
await mocha.loadFilesAsync();
//mocha.run((failures) => process.exit(failures));
mocha.run();
