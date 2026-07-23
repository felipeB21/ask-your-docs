import "server-only";

const FEEDBACK_TO_EMAIL = "bolgarfelipe@gmail.com";
const FROM_ADDRESS = "Ask your docs <onboarding@resend.dev>";

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

async function sendEmail({ to, subject, text, replyTo }: SendEmailParams) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to,
      subject,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend request failed: ${res.status} ${body}`);
  }
}

interface SendFeedbackEmailParams {
  fromName: string;
  fromEmail: string;
  title: string;
  message: string;
}

export async function sendFeedbackEmail({
  fromName,
  fromEmail,
  title,
  message,
}: SendFeedbackEmailParams) {
  await sendEmail({
    to: FEEDBACK_TO_EMAIL,
    replyTo: fromEmail,
    subject: `Feedback: ${title}`,
    text: `From: ${fromName} <${fromEmail}>\n\n${message}`,
  });
}

interface SendPasswordResetEmailParams {
  to: string;
  url: string;
}

export async function sendPasswordResetEmail({
  to,
  url,
}: SendPasswordResetEmailParams) {
  await sendEmail({
    to,
    subject: "Reset your password",
    text: `Click the link below to reset your password:\n\n${url}\n\nIf you didn't request this, you can safely ignore this email.`,
  });
}
