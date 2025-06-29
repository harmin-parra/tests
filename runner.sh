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
cd python
# pip install --break-system-packages -r requirements.txt
pip install -r requirements.txt
playwright install
rfbrowser init

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
cd web_pytest
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
#cd cucumber
#npm install
#npx cucumber-js features/petstore.feature
#cd ..

echo =======================
echo Node.js - Cucumber-html
echo =======================
cd cucumber_html
npm install
npx cucumber-js features/catalog.feature
cd ..

echo ====================
echo Node.js - Playwright
echo ====================
cd playwright
npm install
npx playwright install
HEAD_OPT=""
if [ $HEADLESS = "false" ]; then
  HEAD_OPT = "--headed"
fi
# npx playwright test webform.spec.ts
npx playwright test --project $BROWSER $HEAD_OPT
cd ..

echo =================
echo Node.js - Cypress
echo =================
cd cypress
npm install
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
cd ..
cd ..


echo "##############"
echo "# Java tests #"
echo "##############"
echo "java: " $(java --version)
echo "maven: " $(mvn --version)
cd java

echo ===============
echo Java - Serenity
echo ===============
cd serenity
mvn dependency:resolve
mvn -Dheadless.mode=$HEADLESS -Dwebdriver.driver=$BROWSER clean verify
mv target/site/serenity ../../reporting/report-serenity
cd ..

echo ===================
echo Java - Rest-Assured
echo ===================
cd rest_assured
mvn dependency:resolve
mvn -Dtest="rest_api/CatalogTest" test
cd ..

echo =================
echo Java - Playwright
echo =================
cd playwright
mvn dependency:resolve
# mvn -Dtest="web_playwright/WebFormTest" test
mvn -Dtest="web_playwright/**" -Dbrowser=$BROWSER -Dheadless=$HEADLESS test
cd ..

echo ===============
echo Java - Selenium
echo ===============
cd selenium
mvn dependency:resolve
mvn -Dtest="web_selenium/**" -Dbrowser=$BROWSER -Dheadless=$HEADLESS test  # -Dhub=$HUB test
cd ..

echo =============
echo Java - Karate
echo =============
cd karate
mvn dependency:resolve
# mvn -Dtest="web/**, rest_api/**" -Dbrowser=$BROWSER -Dheadless=$HEADLESS test
mvn -Dtest="web/TestRunner#runner" -Dbrowser=$BROWSER -Dheadless=$HEADLESS test

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
