#!/bin/bash


curl -i -X POST -H 'Content-Type: application/json' -d "`sed "s/:MSG:/$1/" < message.json`" $2
echo '\n'
