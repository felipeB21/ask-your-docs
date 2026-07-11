import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session-helper";
import { processDocument } from "@/lib/documents/process";
import { db } from "@/db";
import { chats } from "@/db/schema";
import { and, eq } from "drizzle-orm";

type Context = {
  params: Promise<{ chatId: string }>;
};

export async function POST(req: NextRequest, context: Context) {
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

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No se envió ningún archivo" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = file.name;
    const fileType = file.type === "application/pdf" ? "pdf" : "docx";

    const text = await processDocument({
      buffer,
      chatId,
      fileName,
      fileType,
      userId,
    });

    return NextResponse.json({ chatId, text });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al procesar el archivo" },
      { status: 500 },
    );
  }
}
