CREATE TABLE IF NOT EXISTS "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_added" timestamp DEFAULT now(),
	"last_modified" timestamp DEFAULT now(),
	"name" text NOT NULL,
	"description" text,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction_tags_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_added" timestamp DEFAULT now(),
	"last_modified" timestamp DEFAULT now(),
	"tag_id" integer,
	"transaction_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_added" timestamp DEFAULT now(),
	"last_modified" timestamp DEFAULT now(),
	"name" text NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "transaction_type_name_unique" UNIQUE("name"),
	CONSTRAINT "transaction_type_description_unique" UNIQUE("description")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_added" timestamp DEFAULT now(),
	"last_modified" timestamp DEFAULT now(),
	"type" integer NOT NULL,
	"source_message_id" integer NOT NULL,
	"transaction_code" text NOT NULL,
	"transaction_amount" integer NOT NULL,
	"subject" text NOT NULL,
	"subject_phone_number" text,
	"subject_account" text,
	"date_time" timestamp NOT NULL,
	"balance" integer,
	"transaction_cost" integer DEFAULT 0,
	"location" text,
	"interest" integer DEFAULT 0,
	"agent_number" text,
	"user_id" integer,
	CONSTRAINT "transaction_transaction_code_unique" UNIQUE("transaction_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"date_added" timestamp DEFAULT now(),
	"last_modified" timestamp DEFAULT now(),
	"username" text NOT NULL,
	"email" text NOT NULL,
	"phone_number" text,
	"password" text NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_phone_number_unique" UNIQUE("phone_number"),
	CONSTRAINT "user_password_unique" UNIQUE("password")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tags" ADD CONSTRAINT "tags_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction_tags_table" ADD CONSTRAINT "transaction_tags_table_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction_tags_table" ADD CONSTRAINT "transaction_tags_table_transaction_id_transaction_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transaction"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction" ADD CONSTRAINT "transaction_type_transaction_type_id_fk" FOREIGN KEY ("type") REFERENCES "public"."transaction_type"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction" ADD CONSTRAINT "transaction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
