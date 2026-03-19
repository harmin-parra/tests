#!/bin/bash

mv python/playwright/reports/junit-report reports/report-junit
mv python/pytest/reports reports/report-pytest
mv python/robotframework/reports/report-robot reports/report-robot

mv nodejs/cucumber/reports/report-cucumber reports/report-cucumber
mv nodejs/cypress/reports/report-cypress reports/report-cypress
# mv nodejs/playwright/reports/report-junit reports/report-junit
mv nodejs/playwright/reports/report-playwright reports/report-playwright

# mv java/playwright/reports/junit-report reports/report-junit
mv java/serenity/target/site/serenity reports/report-serenity
