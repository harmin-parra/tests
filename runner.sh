#!/bin/bash

BROWSER="firefox"
HEADLESS="true"
HUB="localhost"

# Read command-line arguments
while [ $# -gt 0 ]; do
  case $1 in
    --browser)
      BROWSER="$2"
      shift 2
      ;;
    --headless)
      HEADLESS="$2"
      shift 2
      ;;
    *)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done

# Change variable values to lowercase
BROWSER=${BROWSER,,}
cp python/file.xml /tmp/


echo "################"
echo "# Python tests #"
echo "################"
echo "python: "  $(python3 --version)
echo "pip: "  $(pip --version)
cd python
# pip install --break-system-packages -r requirements.txt
pip install -r requirements.txt > /dev/null
playwright install > /dev/null
rfbrowser init > /dev/null

echo =================
echo Python - Cucumber
echo =================
cd cucumber
behave features/catalog.feature
cd ..

echo ===================
echo Python - Playwright
echo ===================
cd playwright
unset PYTHONPATH
export PYTHONPATH=$(pwd)
HEAD_OPT=""
if [ $HEADLESS = "false" ]; then
  HEAD_OPT = "--headed --slowmo 1000"
fi
if [ $BROWSER = "msedge" ] || [ $BROWSER = "chrome" ]; then
  pytest --browser-channel $BROWSER $HEAD_OPT tests/
else
  pytest --browser $BROWSER $HEAD_OPT tests/
fi
cd ..

echo =================
echo Python - Selenium
echo =================
cd selenium
unset PYTHONPATH
export PYTHONPATH=$(pwd)
pytest --driver $BROWSER --headless $HEADLESS  tests/  # --hub $HUB
cd ..

echo ===============
echo Python - Pytest
echo ===============
cd pytest
unset PYTHONPATH
export PYTHONPATH=$(pwd)
if [ $BROWSER = "msedge" ] || [ $BROWSER = "chrome" ]; then
  pytest --driver $BROWSER --headless $HEADLESS --browser-channel $BROWSER $HEAD_OPT
else
  pytest --driver $BROWSER --headless $HEADLESS --browser $BROWSER $HEAD_OPT
fi
cd ..

echo ========================
echo Python - Robot Framework
echo ========================
cd robotframework
HEAD_OPT=""
if [ $HEADLESS = "true" ]; then
  HEAD_OPT="headless"
fi
robot --outputdir ../../reporting/report-robot \
      --listener allure_robotframework:../../reporting/allure-results/python \
      --variable BROWSER:${BROWSER} --variable HEADLESS:${HEADLESS} \
      --variable DRIVER:${HEAD_OPT}${BROWSER} ./
cd ..
cd ..


echo "#################"
echo "# Node.js tests #"
echo "#################"
echo "node.js: " $(nodejs --version)
echo "npm: " $(npm --version)
cd nodejs

echo ==================
echo Node.js - Cucumber
echo ==================
cd cucumber
npm install > /dev/null
npx playwright install > /dev/null
npx cucumber-js -- --browser=$BROWSER --headless=$HEADLESS
cd ..

echo ====================
echo Node.js - Playwright
echo ====================
cd playwright
npm install > /dev/null
npx playwright install > /dev/null
HEAD_OPT=""
if [ $HEADLESS = "false" ]; then
  HEAD_OPT = "--headed"
fi
# npx playwright test webform.spec.ts
npx playwright test --project $BROWSER $HEAD_OPT
cd ..

echo ==================
echo Node.js - Selenium
echo ==================
cd selenium
npm install > /dev/null
npx mocha tests -- --browser=$BROWSER --headless=$HEADLESS
cd ..

echo =================
echo Node.js - Cypress
echo =================
cd cypress
npm install > /dev/null
# npx cypress run --spec tests/webform.cy.ts
HEAD_OPT=""
if [ $HEADLESS = "false" ]; then
  HEAD_OPT="--headed"
fi
BROWSER_OPT=$BROWSER
if [ $BROWSER = "msedge" ]; then
  BROWSER_OPT="edge"
fi
npx cypress run --browser $BROWSER_OPT $HEAD_OPT

# cypress-mochawesome-reporter bug regarding videos folder
# mkdir ../../reporting/report-cypress/videos/tests
# mv ../../reporting/report-cypress/videos/*.mp4 ../../reporting/report-cypress/videos/tests/
cd ..
cd ..


echo "##############"
echo "# Java tests #"
echo "##############"
echo "java: " $(java --version)
cd java

echo =================
echo Java - Playwright
echo =================
cd playwright
# ./mvnw -q dependency:resolve
# ./mvnw test -Dtest="web_playwright/WebFormTest"
# ./mvnw test -Dtest="web_playwright/**" -Dbrowser=$BROWSER -Dheadless=$HEADLESS
./gradlew test --tests="web_playwright.*" -Dbrowser=$BROWSER -Dheadless=$HEADLESS
cd ..

echo ===============
echo Java - Selenium
echo ===============
cd selenium
# ./mvnw -q dependency:resolve
# ./mvnw test -Dtest="web_selenium/**" -Dbrowser=$BROWSER -Dheadless=$HEADLESS  # -Dhub=$HUB test
./gradlew test -Dbrowser=$BROWSER -Dheadless=$HEADLESS
cd ..

echo ===================
echo Java - Cucumber-JVM
echo ===================
cd cucumber
# ./mvnw -q dependency:resolve
# ./mvnw test -Dtest=RunnerTest -Dcucumber.features=classpath:features/webform.feature -Dbrowser=$BROWSER -Dheadless=$HEADLESS
./gradlew test --tests="RunnerTest" -Dcucumber.features=classpath:features/webform.feature -Dbrowser=$BROWSER -Dheadless=$HEADLESS
cd ..

echo ===================
echo Java - Rest-Assured
echo ===================
cd rest_assured
# ./mvnw -q dependency:resolve
# ./mvnw test -Dtest="rest_api/CatalogTest"
./gradlew test --tests="rest_api.CatalogTest"
cd ..

echo ===============
echo Java - Serenity
echo ===============
cd serenity
# ./mvnw -q dependency:resolve
# ./mvnw clean verify -Dheadless.mode=$HEADLESS -Dwebdriver.driver=$BROWSER
./gradlew test -Dheadless.mode=$HEADLESS -Dwebdriver.driver=$BROWSER
mv target/site/serenity ../../reporting/report-serenity
cd ..

echo =============
echo Java - Karate
echo =============
cd karate
# ./mvnw -q dependency:resolve
# ./mvnw test -Dtest="web/**, rest_api/**" -Dbrowser=$BROWSER -Dheadless=$HEADLESS
./mvnw test -Dtest="karate/TestRunner#runner" -Dbrowser=$BROWSER -Dheadless=$HEADLESS > /dev/null
# ./gradlew test --tests="karate.TestRunner.runner" -Dbrowser=$BROWSER -Dheadless=$HEADLESS

# Purge weird Allure Karate entries
mv target/karate-reports ../../reporting/report-karate
for filename in ../../reporting/allure-results/java/*result.json; do
  RES=$(egrep '"testCaseName":"\[[0-9]+:[0-9]+\]' $filename)
  if [ -n "$RES" ]; then
    rm -f $filename
  fi
done
cd ..
cd ..
