CREATE TABLE IF NOT EXISTS "discord_outbound_queue" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"channel_id" text NOT NULL,
	"payload" text NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 3 NOT NULL,
	"last_error" text,
	"next_attempt_at" text NOT NULL,
	"claimed_at" text,
	"fecha_creacion" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "discord_outbound_next_attempt_idx" ON "discord_outbound_queue" USING btree ("next_attempt_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "discord_outbound_created_at_idx" ON "discord_outbound_queue" USING btree ("fecha_creacion");
