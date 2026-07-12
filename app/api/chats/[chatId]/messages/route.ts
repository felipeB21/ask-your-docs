import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session-helper";
import { generateEmbedding } from "@/lib/documents/embed";
import { findRelevantChunks } from "@/lib/documents/search";
import { db } from "@/db";
import { chats, messages } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import {
  convertToModelMessages,
  createTextStreamResponse,
  streamText,
  toTextStream,
  UIMessage,
} from "ai";
import { google } from "@ai-sdk/google";
import { CHAT_MODEL } from "@/lib/ai-config";
import { nanoid } from "nanoid";

type Context = {
  params: Promise<{ chatId: string }>;
};

function getTextFromMessage(message: UIMessage): string {
  const textPart = message.parts.find((part) => part.type === "text");
  return textPart && "text" in textPart ? textPart.text : "";
}

export async function POST(req: NextRequest, context: Context) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    const userId = session.user.id;

    const { chatId } = await context.params;
    if (!chatId) {
      return NextResponse.json(
        { error: "No se encontro el parametro chat" },
        { status: 404 },
      );
    }

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

    const { messages: uiMessages }: { messages: UIMessage[] } =
      await req.json();

    const lastMessage = uiMessages[uiMessages.length - 1];
    const question = getTextFromMessage(lastMessage);

    if (!question) {
      return NextResponse.json(
        { error: "Please, write a message" },
        { status: 400 },
      );
    }

    await db.insert(messages).values({
      id: nanoid(),
      chatId,
      content: question,
      role: "user",
    });

    const embedding = await generateEmbedding(question);
    const relevantChunks = await findRelevantChunks(chatId, embedding);
    const chunkContext = relevantChunks
      .map((chunk) => chunk.content)
      .join("\n\n");

    const result = streamText({
      model: google(CHAT_MODEL),
      system: `You are an assistant that answers questions based on the provided document context.\n\nContext:\n${chunkContext}`,
      messages: await convertToModelMessages(uiMessages),
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

export async function GET(req: NextRequest, context: Context) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { chatId } = await context.params;
  if (!chatId) {
    return NextResponse.json(
      { error: "No se encontro el parametro chat" },
      { status: 404 },
    );
  }

  const chatMessages = await db
    .select({
      id: messages.id,
      content: messages.content,
      role: messages.role,
      createdAt: messages.createdAt,
    })
    .from(messages)
    .innerJoin(chats, eq(messages.chatId, chats.id))
    .where(and(eq(chats.id, chatId), eq(chats.userId, session.user.id)));

  return NextResponse.json(chatMessages);
}
