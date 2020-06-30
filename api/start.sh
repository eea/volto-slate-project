#!/bin/bash

cp -pr /api .
cd ./api
python3 -m venv .
bin/pip install --upgrade pip
apt-get update -q 
apt-get install -y gcc
sed -i "s#allow_origin=.*#allow_origin=\"$CORS_ALLOW_ORIGIN\"#g"  base.cfg
bin/pip install -r requirements.txt
echo "Start buildout"
bin/buildout

sed -i "s#allow_origin=.*#allow_origin=\"$CORS_ALLOW_ORIGIN\"#g"  eggs/kitconcept.volto-1.3.2-py3.7.egg/kitconcept/volto/cors/configure.zcml

bin/robot-server plone.app.robotframework.testing.PLONE_ROBOT_TESTING

