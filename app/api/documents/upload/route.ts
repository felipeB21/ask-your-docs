import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session-helper";
import { db } from "@/db";
import { nanoid } from "nanoid";
import { processDocument } from "@/lib/documents/process";
import { chats } from "@/db/schema";
import { checkDocumentLimit } from "@/lib/limits";
import { validateUploadedFile } from "@/lib/documents/validate";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = session.user.id;

    const documentLimit = await checkDocumentLimit(userId);
    if (!documentLimit.allowed) {
      return NextResponse.json(
        {
          error: `You've reached today's ${documentLimit.limit}-document limit on the Free plan. Upgrade to Pro for unlimited uploads.`,
          code: "LIMIT_EXCEEDED",
        },
        { status: 429 },
      );
    }

    const formData = await req.formData();

    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file was sent" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const validation = validateUploadedFile(buffer);
    if ("error" in validation) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    const { fileType } = validation;
    const fileName = file.name;

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
      { error: "Error processing the PDF" },
      { status: 500 },
    );
  }
}
