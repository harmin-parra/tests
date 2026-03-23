import { defineConfig } from "allure";


const env = ['env1', 'env2', 'env3'];

function env_json() {
  let result = {};
  for (let key in env) {
    result[env[key]] = {
      matcher: ({ labels }) =>
        labels.find(({ name, value }) => name === "env" && value === env[key]),
     };
  }
  return result;
}


const config = {
  name: "Test Report",
  output: "reports/allure3-report",
  // environments: env_json(),
  /*
  plugins: {
    allure3: {
      import: "@allurereport/plugin-awesome",
      options: {
        reportName: "Allure3 report",
        singleFile: false,
        reportLanguage: "en",
        open: false,
        // groupBy: ["parentSuite", "suite", "subSuite"],
      },
    },
    allure2: {
      options: {
        reportName: "Allure2 report",
        singleFile: false,
        reportLanguage: "en",
      },
    },
    classic: {
      options: {
        reportName: "Allure Classic report",
        singleFile: false,
        reportLanguage: "en",
      },
    },
  },
  */
};


export default defineConfig(config);
