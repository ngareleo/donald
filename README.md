# Donald (beta)

This is the backend for our Mapesa platform. This is still a prototype

To start the server you need to

Get deps

`bun install`

Login into supabase for local dev. You will need to create a supabase account

`bun run db:login`

Setup supabase. (Docker desktop is required). No need to run migrations; su-supabase does that automatically.

`bun run db:dev`


To get the connection strings run `bun run db:status`. Recommended (`bun run db:status >> .env` to create env vars)

You'll need to generate ssh keys for signing tokens:

`bun run generate:ssh`


then start the server:

`bun run dev`
