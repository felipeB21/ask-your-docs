import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getSession } from "@/lib/session-helper";
import { db } from "@/db";
import { feedback } from "@/db/schema";
import { sendFeedbackEmail } from "@/lib/resend";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!title || !message) {
    return NextResponse.json(
      { error: "Title and message are required" },
      { status: 400 },
    );
  }

  if (title.length > 200 || message.length > 5000) {
    return NextResponse.json(
      { error: "Title or message is too long" },
      { status: 400 },
    );
  }

  await db.insert(feedback).values({
    id: nanoid(),
    userId: session.user.id,
    title,
    message,
  });

  try {
    await sendFeedbackEmail({
      fromName: session.user.name,
      fromEmail: session.user.email,
      title,
      message,
    });
  } catch (error) {
    console.error("Failed to send feedback email", error);
  }

  return NextResponse.json({ success: true });
}
