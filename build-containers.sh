#!/usr/bin/env bash

docker build . -t renevanderark/chatbot-builder-web
docker build ./nlp -t renevanderark/chatbot-builder-nlp