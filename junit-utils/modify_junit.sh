#!/bin/bash

env_names=('ENV1' 'ENV2' 'ENV3')
report_files=("${PIPELINE_WORKSPACE}/env1/results.xml" "${PIPELINE_WORKSPACE}/env2/results.xml" "${PIPELINE_WORKSPACE}/env3/results.xml")
screenshot_folders=('env1' 'env2' 'env3')

for i in "${!report_files[@]}"
do
  sed -i "0,/<testsuites/s//<testsuites screenshot_folder=\"${screenshot_folders[$i]}\"/" "${report_files[$i]}"
  # sed -i "s#value=\"screenshots/#value=\"${screenshot_folders[$i]}/screenshots/#g" "${report_files[$i]}"
done

for i in "${!report_files[@]}"
do
  sed -i "0,/<testsuites/s//<testsuites env=\"${env_names[$i]}\"/" "${report_files[$i]}"
done
