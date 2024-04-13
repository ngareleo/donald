#!/bin/bash
bun run migrate 
bun run generate:ssh
bun run start