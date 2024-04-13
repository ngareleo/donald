#!/bin/bash
bun run migrate 

apt-get update && apt-get install -y openssl
bun run generate:ssh

bun run start