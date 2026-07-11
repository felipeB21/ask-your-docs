import { cosineDistance, desc, sql, eq } from "drizzle-orm";
import { chunks, documents } from "@/db/schema";
import { db } from "@/db";

export async function findRelevantChunks(
  chatId: string,
  queryEmbedding: number[],
  limit = 5,
) {
  const similarity = sql<number>`1 - (${cosineDistance(chunks.embedding, queryEmbedding)})`;

  const results = await db
    .select({
      content: chunks.content,
      similarity,
    })
    .from(chunks)
    .innerJoin(documents, eq(chunks.documentId, documents.id))
    .where(eq(documents.chatId, chatId))
    .orderBy((t) => desc(t.similarity))
    .limit(limit);

  return results;
}
