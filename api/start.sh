#!/bin/bash

cp -pr /api .
cd ./api
python3 -m venv .
bin/pip install --upgrade pip
apt-get update -q 
apt-get install -y gcc
bin/pip install -r requirements.txt
echo "Start buildout"
bin/buildout
sed -i "s#allow_origin=.*#allow_origin=\"$CORS_ALLOW_ORIGIN\"#"     parts/instance/etc/package-includes/999-additional-overrides.zcml
bin/robot-server plone.app.robotframework.testing.PLONE_ROBOT_TESTING

