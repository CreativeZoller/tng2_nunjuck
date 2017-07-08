#! /usr/bin/env bash
bower=./node_modules/.bin/bower
git config url."https://".insteadOf git://

rm -rf node_modules && rm -rf bower_components
npm install
$bower install && $bower prune
