CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" serial NOT NULL,
	"date_added" timestamp DEFAULT now(),
	"last_modified" timestamp DEFAULT now()
);
