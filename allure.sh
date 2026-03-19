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
      reports/allure-results/java/cucumber \
      reports/allure-results/java/playwright \
      reports/allure-results/java/rest_assured \
      reports/allure-results/java/selenium

#
# Node.js Allure report
#
allure generate \
  --clean \
  --output reports/allure-reports/report-nodejs \
  --single-file reports/allure-results \
      reports/allure-results/nodejs/cucumber \
      reports/allure-results/nodejs/cypress \
      reports/allure-results/nodejs/playwright \
      reports/allure-results/nodejs/selenium

#
# Python Allure report
#
allure generate \
  --clean \
  --output reports/allure-reports/report-python \
  --single-file reports/allure-results \
      reports/allure-results/python/cucumber \
      reports/allure-results/python/playwright \
      reports/allure-results/python/robotframework \
      reports/allure-results/python/selenium

