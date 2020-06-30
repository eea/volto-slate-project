#!/bin/bash

cp -pr /api .
cd ./api
python3 -m venv .
bin/pip install --upgrade pip
apt-get update -q 
apt-get install -y --no-install-recommends gcc
bin/pip install -r requirements.txt
echo "Start buildout"
bin/buildout

bin/robot-server plone.app.robotframework.testing.PLONE_ROBOT_TESTING

