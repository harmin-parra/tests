#!/bin/bash

#
# Java Allure report
#
allure awesome \
  --output reports/allure3-reports/report-java \
  --single-file reports/allure-results/java/playwright

#
# Node.js Allure report
#
allure awesome \
  --output reports/allure3-reports/report-nodejs \
  --single-file reports/allure-results/nodejs/playwright

#
# Python Allure report
#
allure awesome \
  --output reports/allure3-reports/report-python \
  --single-file reports/allure-results/python/playwright
