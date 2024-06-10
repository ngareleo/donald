#!/bin/bash

function check_ssl () {
    # Get openssl
    if ! [ -e "/usr/bin/openssl" ];
    then
        apt-get update && apt-get install -y openssl
    fi
}

function gen_ssl_files () {
    # Gen keys
    # TODO Write script to persist across restarts
    if ! [ -e "./temp" ];
    then
        bun run generate:ssh
    fi
}

bun run migrate
check_ssl
gen_ssl_files
bun run start
