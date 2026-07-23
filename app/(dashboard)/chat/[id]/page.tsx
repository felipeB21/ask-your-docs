import ChatWorkspace from "@/components/dashboard/chat/chat-workspace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ChatIdPage({ params }: PageProps) {
  const { id } = await params;
  return <ChatWorkspace chatId={id} />;
}
