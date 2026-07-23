import { db } from "@/db";
import { account } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function hasPasswordAccount(userId: string) {
  const [existing] = await db
    .select({ id: account.id })
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, "credential")));
  return Boolean(existing);
}
