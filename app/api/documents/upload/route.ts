import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session-helper";
import { db } from "@/db";
import { nanoid } from "nanoid";
import { processDocument } from "@/lib/documents/process";
import { chats } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    const userId = session.user.id;
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

    const chatId = nanoid();
    await db.insert(chats).values({
      id: chatId,
      userId,
      title: fileName,
    });

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
      { error: "Error al procesar el PDF" },
      { status: 500 },
    );
  }
}
