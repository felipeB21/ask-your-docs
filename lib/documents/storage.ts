import { eq } from "drizzle-orm";
import { db } from "@/db";
import { chats, documents } from "@/db/schema";
import { supabase } from "@/lib/supabase";

async function deleteStorageObjects(paths: (string | null)[]) {
  const validPaths = paths.filter((path): path is string => Boolean(path));
  if (validPaths.length === 0) return;

  const { error } = await supabase.storage.from("documents").remove(validPaths);
  if (error) throw new Error(error.message);
}

export async function deleteChatDocumentFiles(chatId: string) {
  const rows = await db
    .select({ storagePath: documents.storagePath })
    .from(documents)
    .where(eq(documents.chatId, chatId));

  await deleteStorageObjects(rows.map((row) => row.storagePath));
}

export async function deleteUserDocumentFiles(userId: string) {
  const rows = await db
    .select({ storagePath: documents.storagePath })
    .from(documents)
    .innerJoin(chats, eq(documents.chatId, chats.id))
    .where(eq(chats.userId, userId));

  await deleteStorageObjects(rows.map((row) => row.storagePath));
}
