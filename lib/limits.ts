import { db } from "@/db";
import { chats, documents, messages } from "@/db/schema";
import { and, count, eq, gte } from "drizzle-orm";
import { getSubscription, isProStatus } from "./subscription";

export const FREE_DOCUMENT_LIMIT = 2;
export const FREE_MESSAGE_LIMIT = 10;

export interface LimitCheck {
  allowed: boolean;
  used: number;
  limit: number;
}

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export async function checkDocumentLimit(userId: string): Promise<LimitCheck> {
  const subscription = await getSubscription(userId);
  if (isProStatus(subscription?.status)) {
    return { allowed: true, used: 0, limit: Infinity };
  }

  const [{ value }] = await db
    .select({ value: count() })
    .from(documents)
    .innerJoin(chats, eq(documents.chatId, chats.id))
    .where(and(eq(chats.userId, userId), gte(documents.createdAt, startOfToday())));

  return {
    allowed: value < FREE_DOCUMENT_LIMIT,
    used: value,
    limit: FREE_DOCUMENT_LIMIT,
  };
}

export async function checkMessageLimit(userId: string): Promise<LimitCheck> {
  const subscription = await getSubscription(userId);
  if (isProStatus(subscription?.status)) {
    return { allowed: true, used: 0, limit: Infinity };
  }

  const [{ value }] = await db
    .select({ value: count() })
    .from(messages)
    .innerJoin(chats, eq(messages.chatId, chats.id))
    .where(
      and(
        eq(chats.userId, userId),
        eq(messages.role, "user"),
        gte(messages.createdAt, startOfToday()),
      ),
    );

  return {
    allowed: value < FREE_MESSAGE_LIMIT,
    used: value,
    limit: FREE_MESSAGE_LIMIT,
  };
}
