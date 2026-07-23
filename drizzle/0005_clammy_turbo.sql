CREATE INDEX "chunks_documentId_idx" ON "chunks" USING btree ("document_id");--> statement-breakpoint
CREATE INDEX "documents_chatId_idx" ON "documents" USING btree ("chat_id");--> statement-breakpoint
CREATE INDEX "feedback_userId_idx" ON "feedback" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "messages_chatId_idx" ON "messages" USING btree ("chat_id");