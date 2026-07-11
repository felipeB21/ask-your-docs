import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session-helper";
import { generateEmbedding } from "@/lib/documents/embed";
import { findRelevantChunks } from "@/lib/documents/search";
import { db } from "@/db";
import { chats, messages } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { createTextStreamResponse, streamText, toTextStream } from "ai";
import { google } from "@ai-sdk/google";
import { CHAT_MODEL } from "@/lib/ai-config";
import { nanoid } from "nanoid";

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

    const body = await req.json();
    const { message } = body;
    if (!message) {
      return NextResponse.json(
        { error: "Please, write a message" },
        { status: 404 },
      );
    }
    await db.insert(messages).values({
      id: nanoid(),
      chatId,
      content: message,
      role: "user",
    });

    const embedding = await generateEmbedding(message);
    const relevantChunks = await findRelevantChunks(chatId, embedding);

    const chunkContext = relevantChunks.map((chunk) => chunk.content).join("");

    const result = streamText({
      model: google(CHAT_MODEL),
      system:
        "You are an assistant that answers questions based on the provided document context.",
      prompt: `Context:\n${chunkContext}\n\nQuestion: ${message}`,
      onFinish: async ({ text }) => {
        try {
          await db.insert(messages).values({
            id: nanoid(),
            chatId,
            content: text,
            role: "ai",
          });
        } catch (error) {
          console.error("Failed to save message to database:", error);
        }
      },
    });

    return createTextStreamResponse({
      stream: toTextStream({ stream: result.stream }),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al generar la respuesta" },
      { status: 500 },
    );
  }
}
