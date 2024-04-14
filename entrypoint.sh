#!/bin/bash

# Run migrations
bun run migrate 

# Get openssl 
if ! [[ -e "/usr/bin/openssl" ]]; then
    apt-get update && apt-get install -y openssl
fi

# Gen keys
# TODO! Write script to persist across restarts
if ! [[ -e "./temp" ]]; then
    bun run generate:ssh
fi

bun run start