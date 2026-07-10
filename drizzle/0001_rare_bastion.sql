CREATE TYPE "public"."file_type" AS ENUM('pdf', 'docx');--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "file_type" "file_type" DEFAULT 'pdf' NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "storage_path" text;