DROP INDEX "lesson_chat_user_lesson_idx";--> statement-breakpoint
ALTER TABLE "lesson_chat_message" ADD COLUMN "seq" bigserial NOT NULL;--> statement-breakpoint
CREATE INDEX "lesson_chat_user_lesson_idx" ON "lesson_chat_message" USING btree ("user_id","lesson_path","seq");