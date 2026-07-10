import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { supabase } from "../supabase";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { nanoid } from "nanoid";

interface ProcessDocumentParams {
  buffer: Buffer;
  fileName: string;
  fileType: "pdf" | "docx";
  userId: string;
  chatId: string;
}

export async function processDocument({
  buffer,
  fileName,
  fileType,
  userId,
  chatId,
}: ProcessDocumentParams) {
  let extractedText: string;

  if (fileType === "pdf") {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    extractedText = result.text;
  } else {
    const result = await mammoth.extractRawText({ buffer });
    extractedText = result.value;
  }

  const mimeType =
    fileType === "pdf"
      ? "application/pdf"
      : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  const { data, error } = await supabase.storage
    .from("documents")
    .upload(`${userId}/${fileName}`, buffer, {
      contentType: mimeType,
    });

  if (error) {
    return error.message;
  }

  await db.insert(documents).values({
    id: nanoid(),
    fileName: fileName,
    fileType: fileType,
    status: "ready",
    storagePath: data.path,
    chatId: chatId,
  });

  return extractedText;
}
