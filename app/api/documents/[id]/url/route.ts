import { db } from "@/db";
import { getSession } from "@/lib/session-helper";
import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { chats, documents } from "@/db/schema";
import { supabase } from "@/lib/supabase";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, context: Context) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }
  const userId = session.user.id;

  const { id } = await context.params;
  if (!id)
    return NextResponse.json(
      { error: "No se encontro el documento" },
      { status: 404 },
    );

  const [document] = await db
    .select({
      id: documents.id,
      storagePath: documents.storagePath,
      fileType: documents.fileType,
    })
    .from(documents)
    .innerJoin(chats, eq(documents.chatId, chats.id))
    .where(and(eq(documents.id, id), eq(chats.userId, userId)));

  if (!document)
    return NextResponse.json(
      { error: "Document not founded" },
      { status: 404 },
    );

  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(document.storagePath!, 360);

  if (error) return NextResponse.json({ error }, { status: 401 });

  return NextResponse.json(
    { fileType: document.fileType, data },
    { status: 200 },
  );
}
