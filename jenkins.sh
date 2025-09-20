#!/bin/bash

sudo docker run \
  --name jenkins \
  --user jenkins \
  --group-add 983 \
  -p 8080:8080 -p 50000:50000 \
  --restart=on-failure \
  -v /usr/bin/docker:/usr/bin/docker \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts-jdk-17
