#!/bin/bash

env_names=('ENV1' 'ENV2' 'ENV3')
report_files=("reports/report-junit/env1/report.xml" "reports/report-junit/env2/report.xml" "reports/report-junit/env3/report.xml")
screenshot_folders=('env1' 'env2' 'env3')

for i in "${!report_files[@]}"
do
  sed -i "0,/<testsuites/s//<testsuites env=\"${env_names[$i]}\" screenshot_folder=\"${screenshot_folders[$i]}\"/" ${report_files[$i]}
done
