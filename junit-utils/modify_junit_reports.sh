#!/bin/bash

env_names=(
  'C21'
  'GH'
  'CITYA'
  'LA FORET'
)
report_files=(
  "./junit_report_recette_c21/results.xml"
  "./junit_report_recette_gh/results.xml"
  "./junit_report_recette_citya/results.xml"
  "./junit_report_recette_laforet/results.xml"
)
screenshot_folders=(
  'recette_c21'
  'recette_gh'
  'recette_citya'
  'recette_laforet'
)

for i in "${!report_files[@]}"
do
  sed -i "0,/<testsuites/s//<testsuites env=\"${env_names[$i]}\" screenshot_folder=\"${screenshot_folders[$i]}\"/" ${report_files[$i]}
done
