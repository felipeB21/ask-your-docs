import ChatPanel from "@/components/dashboard/chat/chat-panel";
import DocumentViewer from "@/components/dashboard/document-viewer";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ChatIdPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="grid grid-cols-2 gap-5 h-full min-h-0">
      <DocumentViewer chatId={id} />
      <ChatPanel chatId={id} />
    </div>
  );
}
