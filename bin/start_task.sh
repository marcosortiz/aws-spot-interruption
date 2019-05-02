#!/usr/bin/env bash 

nohup ruby src/watchdog.rb > /dev/null 2>&1 &
nohup node src/app.js > app.log 2>&1 &