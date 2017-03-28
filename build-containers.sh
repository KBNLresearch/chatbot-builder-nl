#!/usr/bin/env bash

docker build -t renevanderark/chatbot-builder-web .
docker build -t renevanderark/chatbot-builder-nlp ./nlp
docker build -t renevanderark/chatbot-builder-sample-webhook ./sample-webhook
