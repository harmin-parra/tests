#!/bin/bash

BROWSER="firefox"

# Read command-line arguments
while [ $# -gt 0 ]; do
  case $1 in
    --browser)
      BROWSER="$2"
      shift 2
      ;;
    *)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done

# Browser with initial uppercase
BROWSER=${BROWSER,,}
BROWSER=${BROWSER^}
# Replace Msedge by Edge
if [ $BROWSER = "Msedge" ]; then
  BROWSER="Edge"
fi


#
# Allure metadata
#
if [ -f repors/allure-results/job.url ]; then
  cat << EOF > reports/allure-results/executor.json
{
  "name": "${EXECUTOR_NAME}",
  "type": "${EXECUTOR_TYPE}",
  "buildName": "Build log",
  "buildUrl": "$(cat reports/allure-results/job.url)",
  "reportName": "Test Report"
}
EOF
fi


#
# Java Allure report
#
allure generate \
  --clean \
  --output reports/allure-reports/report-java \
  --single-file reports/allure-results \
      reports/java/cucumber/reports/allure-results \
      reports/java/playwright/reports/allure-results \
      reports/java/rest_assured/reports/allure-results \
      reports/java/selenium/reports/allure-results 

#
# Node.js Allure report
#
allure generate \
  --clean \
  --output reports/allure-reports/report-nodejs \
  --single-file reports/allure-results \
      reports/nodejs/cucumber/reports/allure-results \
      reports/nodejs/cypress/reports/allure-results \
      reports/nodejs/playwright/reports/allure-results \
      reports/nodejs/selenium/reports/allure-results

#
# Python Allure report
#
allure generate \
  --clean \
  --output reports/allure-reports/report-python \
  --single-file reports/allure-results \
      reports/python/cucumber/reports/allure-results \
      reports/python/playwright/reports/allure-results \
      reports/python/robotframework/reports/allure-results \
      reports/python/selenium/reports/allure-results
