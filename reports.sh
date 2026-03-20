#!/bin/bash

mkdir -p reports/allure-results/java reports/allure-results/python reports/allure-results/nodejs
mkdir -p reports/report-junit/python reports/report-junit/nodejs

#
# Move tool-specific reports
#
mv python/playwright/reports/report-junit/* reports/report-junit/python
mv python/pytest/reports reports/report-pytest
mv python/robotframework/reports/report-robot reports/report-robot

mv nodejs/cucumber/reports/report-cucumber reports/report-cucumber
mv nodejs/cypress/reports/report-cypress reports/report-cypress
mv nodejs/playwright/reports/report-playwright reports/report-playwright
mv nodejs/playwright/reports/report-junit/* reports/report-junit/nodejs

mv java/serenity/target/site/serenity reports/report-serenity
mv java/playwright/reports/report-junit reports/report-junit/java
set +e
python junit/utils/merge_junit_xml.py -d reports/report-junit/java/xml -o reports/report-junit/java/report.xml
set -e

#
# Move Allure results
#
mv java/cucumber/reports/allure-results reports/allure-results/java/cucumber
mv java/playwright/reports/allure-results reports/allure-results/java/playwright
mv java/rest_assured/reports/allure-results reports/allure-results/java/rest_assured
mv java/selenium/reports/allure-results reports/allure-results/java/selenium

mv python/cucumber/reports/allure-results reports/allure-results/python/cucumber
mv python/playwright/reports/allure-results reports/allure-results/python/playwright
mv python/robotframework/reports/allure-results reports/allure-results/python/robotframework
mv python/selenium/reports/allure-results reports/allure-results/python/selenium

mv nodejs/cucumber/reports/allure-results reports/allure-results/nodejs/cucumber
mv nodejs/cypress/reports/allure-results reports/allure-results/nodejs/cypress
mv nodejs/playwright/reports/allure-results reports/allure-results/nodejs/playwright
mv nodejs/selenium/reports/allure-results reports/allure-results/nodejs/selenium

