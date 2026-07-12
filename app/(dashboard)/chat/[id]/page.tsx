import ChatPanel from "@/components/dashboard/chat/chat-panel";
import { requireUser } from "@/lib/session-helper";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ChatIdPage({ params }: PageProps) {
  const { id } = await params;
  await requireUser();
  return (
    <div className="grid grid-cols-2 gap-5">
      <p>PDF or DOCx</p>
      <ChatPanel chatId={id} />
    </div>
  );
}
