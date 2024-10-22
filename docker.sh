#!/bin/bash

DOCKER=""
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
    --docker)
      DOCKER="$2"
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
cp tests-python/file.xml /tmp/test/

#
# Python tests
#
if [ $DOCKER = "playwright/python" ] || [ $DOCKER = "selenium/python" ] || [ $DOCKER = "robotframework/playwright" ]; then
  cd tests-python
  pip install -r requirements.txt
  playwright install-deps
  playwright install
  export PYTHONPATH=$(pwd)

  if [ $DOCKER = "playwright/python" ]; then
    behave cucumber/features/petstore.feature
    if [ $BROWSER = "msedge" ] || [ $BROWSER = "chrome" ]; then
      pytest web_playwright/tests/ --browser-channel $BROWSER
    else
      pytest web_playwright/tests/ --browser $BROWSER
    fi
  fi

  if [ $DOCKER = "selenium/python" ]; then
    pytest web_selenium/tests/ --driver $BROWSER --hub $HUB
  fi

  if [ $DOCKER = "robotframework/playwright" ]; then
    robot --variable BROWSER:${BROWSER} --outputdir ../reporting/report-robot ./
  fi

  unset PYTHONPATH
  cd ..
fi

#
# Node.js tests
#
if [ $DOCKER = "playwright/node.js" ] || [ $DOCKER = "cypress" ]; then
  cd tests-nodejs
  npm install

  if [ $DOCKER = "playwright/node.js" ]; then
    npx playwright install-deps
    npx playwright install
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


#
# Java tests
#
if [ $DOCKER = "playwright/java" ] || [ $DOCKER = "selenium/java" ] || [ $DOCKER = "karate" ]; then
  cd tests-java
  mvn dependency:resolve

  if [ $DOCKER = "playwright/java" ]; then
    mvn -Dtest="web_playwright/**, rest_api_rest_assured/**" -Dbrowser=$BROWSER test

  elif [ $DOCKER = "selenium/java" ]; then
    mvn -Dtest="web_selenium/**" -Dbrowser=$BROWSER test -Dhub=$HUB test

  elif [ $DOCKER = "karate" ]; then
    mvn -Dtest="karate/TestRunner#allTests" -Dbrowser=$BROWSER test
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
