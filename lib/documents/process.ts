import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { supabase } from "../supabase";
import { db } from "@/db";
import { chunks, documents } from "@/db/schema";
import { nanoid } from "nanoid";
import { chunkText } from "./chunk";
import { generateEmbedding } from "./embed";

interface ProcessDocumentParams {
  buffer: Buffer;
  fileName: string;
  fileType: "pdf" | "docx";
  userId: string;
  chatId: string;
}

function sanitizeFileName(fileName: string): string {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
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

  const sanitizedFileName = sanitizeFileName(fileName);

  const { data, error } = await supabase.storage
    .from("documents")
    .upload(`${userId}/${sanitizedFileName}`, buffer, {
      contentType: mimeType,
    });

  if (error) throw new Error(error.message);

  const documentId = nanoid();

  await db.insert(documents).values({
    id: documentId,
    fileName: fileName,
    fileType: fileType,
    status: "ready",
    storagePath: data.path,
    chatId: chatId,
  });

  const textChunks = chunkText(extractedText, 1000);

  for (const [i, chunk] of textChunks.entries()) {
    const embedding = await generateEmbedding(chunk);
    await db.insert(chunks).values({
      id: nanoid(),
      documentId: documentId,
      content: chunk,
      embedding: embedding,
      chunkIndex: i,
    });
  }

  return extractedText;
}
