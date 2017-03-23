#!/bin/bash


curl -i -X POST -H 'Content-Type: application/json' -d "`sed "s/:PAYLOAD:/$1/" < postback.json`"  $2
echo "\n"
