#!/usr/bin/env bash

docker build -t renevanderark/chatbot-builder-web .
docker build -t renevanderark/chatbot-builder-nlp ./nlp
