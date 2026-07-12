import ChatPanel from "@/components/dashboard/chat/chat-panel";
import { requireUser } from "@/lib/session-helper";
export default async function ChatIdPage() {
  const user = await requireUser();
  return (
    <div className="grid grid-cols-2 gap-5">
      <p>PDF or DOCx</p>
      <ChatPanel username={user.name} />
    </div>
  );
}
