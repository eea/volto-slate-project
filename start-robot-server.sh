#!/bin/bash

sed -i "s#allow_origin=.*#allow_origin=\"$CORS_ALLOW_ORIGIN\"#g"  /plone/buildout-cache/eggs/kitconcept.volto-*/kitconcept/volto/cors/configure.zcml

cat  /plone/buildout-cache/eggs/kitconcept.volto-*/kitconcept/volto/cors/configure.zcml

bin/robot-server plone.app.robotframework.testing.PLONE_ROBOT_TESTING
