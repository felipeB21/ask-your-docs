"use client";

import { useRef } from "react";
import ChatPanel, { ChatPanelHandle } from "@/components/dashboard/chat/chat-panel";
import DocumentViewer from "@/components/dashboard/document-viewer";

export default function ChatWorkspace({ chatId }: { chatId: string }) {
  const chatPanelRef = useRef<ChatPanelHandle>(null);

  return (
    <div className="grid grid-cols-2 gap-5 h-full min-h-0">
      <DocumentViewer
        chatId={chatId}
        onExplain={(text) => chatPanelRef.current?.explainText(text)}
      />
      <ChatPanel ref={chatPanelRef} chatId={chatId} />
    </div>
  );
}
