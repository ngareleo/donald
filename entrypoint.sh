#!/bin/sh

bun run db:migrate

echo "Migrations complete"

bun run start