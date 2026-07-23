import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session-helper";
import { db } from "@/db";
import { chats } from "@/db/schema";
import { and, eq } from "drizzle-orm";

type Context = {
  params: Promise<{ chatId: string }>;
};

export async function PATCH(req: NextRequest, context: Context) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;

  const { chatId } = await context.params;

  const body = await req.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : undefined;
  const isFavorite =
    typeof body?.isFavorite === "boolean" ? body.isFavorite : undefined;

  if (title === undefined && isFavorite === undefined) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  if (title !== undefined && title.length === 0) {
    return NextResponse.json({ error: "Title cannot be empty" }, { status: 400 });
  }

  const [existingChat] = await db
    .select()
    .from(chats)
    .where(and(eq(chats.id, chatId), eq(chats.userId, userId)));

  if (!existingChat) {
    return NextResponse.json(
      { error: "The specified chat does not exist" },
      { status: 404 },
    );
  }

  const [updatedChat] = await db
    .update(chats)
    .set({
      ...(title !== undefined && { title }),
      ...(isFavorite !== undefined && { isFavorite }),
    })
    .where(eq(chats.id, chatId))
    .returning();

  return NextResponse.json(updatedChat);
}

export async function DELETE(req: NextRequest, context: Context) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;

  const { chatId } = await context.params;

  const [existingChat] = await db
    .select()
    .from(chats)
    .where(and(eq(chats.id, chatId), eq(chats.userId, userId)));

  if (!existingChat) {
    return NextResponse.json(
      { error: "The specified chat does not exist" },
      { status: 404 },
    );
  }

  await db.delete(chats).where(eq(chats.id, chatId));

  return NextResponse.json({ success: true });
}
