#!/bin/bash

env_names=('C21' 'GH' 'CITYA')
report_files=("${PIPELINE_WORKSPACE}/junit_report_recette_c21/results.xml" "${PIPELINE_WORKSPACE}/junit_report_recette_gh/results.xml" "${PIPELINE_WORKSPACE}/junit_report_recette_citya/results.xml")
screenshot_folders=('recette_c21' 'recette_gh' 'recette_citya')

for i in "${!report_files[@]}"
do
  sed -i "0,/<testsuites/s//<testsuites screenshot_folder=\"${screenshot_folders[$i]}\"/" "${report_files[$i]}"
  # sed -i "s#value=\"screenshots/#value=\"${screenshot_folders[$i]}/screenshots/#g" "${report_files[$i]}"
done

for i in "${!report_files[@]}"
do
  sed -i "0,/<testsuites/s//<testsuites env=\"${env_names[$i]}\"/" "${report_files[$i]}"
done
