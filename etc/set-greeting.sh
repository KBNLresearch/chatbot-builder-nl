#!/bin/bash

curl -X POST -H "Content-Type: application/json" -d "{
  \"setting_type\":\"greeting\",
  \"greeting\":{
    \"text\": \"$1\"
  }
}" "https://graph.facebook.com/v2.6/me/thread_settings?access_token=$MESSENGER_PAGE_ACCESS_TOKEN"
