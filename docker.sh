#!/bin/bash

TEST=""
BROWSER="Firefox"
HUB=""

# Read command-line arguments
while [ $# -gt 0 ]; do
  case $1 in
    --browser)
      BROWSER="$2"
      shift 2
      ;;
    --hub)
      HUB="$2"
      shift 2
      ;;
    --test)
      TEST="$2"
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

rm -rf reporting/*
mkdir /tmp/test
cp python/file.xml /tmp/test/
mkdir -p reporting/allure-results/java reporting/allure-results/python reporting/allure-results/nodejs

#
# Python tests
#
if [ $TEST = "python/playwright" ] || [ $TEST = "selenium/python" ] || [ $TEST = "robotframework/playwright" ]; then
  cd tests-python
  pip install -r requirements.txt
  playwright install-deps
  playwright install
  export PYTHONPATH=$(pwd)

  if [ $TEST = "playwright/python" ]; then
    behave cucumber/features/petstore.feature
    if [ $BROWSER = "msedge" ] || [ $BROWSER = "chrome" ]; then
      pytest web_playwright/tests/ --browser-channel $BROWSER
    else
      pytest web_playwright/tests/ --browser $BROWSER
    fi
  fi

  if [ $TEST = "selenium/python" ]; then
    pytest web_selenium/tests/ --driver $BROWSER --hub $HUB
  fi

  if [ $TEST = "robotframework/playwright" ]; then
    robot --variable BROWSER:${BROWSER} --outputdir ../reporting/report-robot ./
  fi

  unset PYTHONPATH
  cd ..
fi

#
# Node.js tests
#
if [ $TEST = "playwright/node.js" ] || [ $TEST = "cypress" ]; then
  cd tests-nodejs
  npm install
  npx playwright install-deps
  npx playwright install

  if [ $TEST = "playwright/node.js" ]; then
    npx cucumber-js cucumber/features/petstore.feature
    npx playwright test --project $BROWSER

  else
    if [[ $BROWSER == *"edge" ]]; then
      npx cypress run --browser edge --headless
    else
      npx cypress run --browser $BROWSER --headless
    fi
  fi

  cd ..
fi

# Cypress
if [ $TEST = "nodejs/cypress" ]; then
  cd $TEST
  npm install
  if [[ $BROWSER == *"edge" ]]; then
    npx cypress run --browser edge --headless
  else
    npx cypress run --browser $BROWSER --headless
  fi
  cd ..
fi

#
# Java tests
#
if [ $TEST = "playwright/java" ] || [ $TEST = "selenium/java" ] || [ $TEST = "karate" ]; then
  cd tests-java
  mvn dependency:resolve

  if [ $TEST = "playwright/java" ]; then
    mvn -Dtest="web_playwright/**, rest_api_rest_assured/**" -Dbrowser=$BROWSER test

  elif [ $TEST = "selenium/java" ]; then
    mvn -Dtest="web_selenium/**" -Dbrowser=$BROWSER test -Dhub=$HUB test

  elif [ $TEST = "karate" ]; then
    mvn -Dtest="web/TestRunner#runner" -Dbrowser=$BROWSER test
    for filename in ../reporting/allure-results/java/*result.json; do
      RES=$(egrep '"testCaseName":"\[[0-9]+:[0-9]+\]' $filename)
      if [ -n "$RES" ]; then
        rm -f $filename
      fi
    done
    mv tests-java/target/karate-reports reporting/report-karate
  fi

  cd ..
fi

# karate
if [ $TEST = "java/karate" ]; then
  cd $TEST
  mvn dependency:resolve
  mvn -Dtest="web/TestRunner#runner" -Dbrowser=$BROWSER -Dheadless=$HEADLESS test
  for filename in ../../reporting/allure-results/java/*result.json; do
    RES=$(egrep '"testCaseName":"\[[0-9]+:[0-9]+\]' $filename)
    if [ -n "$RES" ]; then
      rm -f $filename
    fi
  done
  cd ../..
fi

# Serenity
if [ $TEST = "java/serenity" ]; then
  cd $TEST
  mvn dependency:resolve
  mvn -Dheadless.mode=$HEADLESS -Dwebdriver.driver=$BROWSER clean verify
  cd ../..
fi


# RestAssured
if [ $TEST = "java/rest_assured" ]; then
  cd $TEST
  mvn dependency:resolve
  mvn -Dtest="rest_api/CatalogTest" test
  cd ../..
fi
