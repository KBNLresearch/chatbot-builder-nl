#!/usr/bin/env bash

gunicorn -w 4 -b 0.0.0.0:5001 -k gevent clips:app