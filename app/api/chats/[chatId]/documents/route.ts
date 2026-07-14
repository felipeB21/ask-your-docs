import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session-helper";
import { db } from "@/db";
import { chats, documents } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

type Context = {
  params: Promise<{ chatId: string }>;
};

export async function GET(req: NextRequest, context: Context) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    const userId = session.user.id;

    const { chatId } = await context.params;
    if (!chatId)
      return NextResponse.json(
        { error: "No se encontro el parametro chat" },
        { status: 404 },
      );

    const [existingChat] = await db
      .select()
      .from(chats)
      .where(and(eq(chats.id, chatId), eq(chats.userId, userId)));

    if (!existingChat) {
      return NextResponse.json(
        { error: "El chat especificado no existe" },
        { status: 404 },
      );
    }

    const existingDocuments = await db
      .select()
      .from(documents)
      .where(eq(documents.chatId, chatId))
      .orderBy(desc(documents.updatedAt));

    return NextResponse.json({ data: existingDocuments }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al procesar el archivo" },
      { status: 500 },
    );
  }
}
