#!/usr/bin/env bash

mkdir ./files
cp sample-import.txt ./files/dialogs.json
npm run build
npm start