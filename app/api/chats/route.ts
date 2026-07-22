import { NextResponse } from "next/server";
import { getSession } from "@/lib/session-helper";
import { db } from "@/db";
import { chats } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userChats = await db
    .select()
    .from(chats)
    .where(eq(chats.userId, session.user.id));

  return NextResponse.json(userChats);
}
