import { db } from "@/db";
import { chats } from "@/db/schema";
import { getSession } from "@/lib/session-helper";
import { eq } from "drizzle-orm";

export const getRecentChats = async () => {
  const session = await getSession();
  if (!session) return;

  return await db.select().from(chats).where(eq(chats.userId, session.user.id));
};
