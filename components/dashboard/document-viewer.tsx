"use client";

import dynamic from "next/dynamic";
import { FileText, Inbox } from "lucide-react";
import { useChatDocument } from "@/hooks/use-chat-documents";
import { useDocumentUrl } from "@/hooks/use-document";

const PdfViewer = dynamic(() => import("./pdf-viewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center rounded-xl  text-sm text-muted-foreground">
      Loading viewer...
    </div>
  ),
});

export default function DocumentViewer({ chatId }: { chatId: string }) {
  const { data: chatDocuments, isPending: isLoadingDocuments } =
    useChatDocument(chatId);

  const document = chatDocuments?.[0];

  const { data: documentUrl, isPending: isLoadingUrl } = useDocumentUrl(
    document?.id ?? "",
  );

  if (isLoadingDocuments) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl  text-sm text-muted-foreground">
        Loading document...
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 rounded-xl  text-sm text-muted-foreground">
        <Inbox className="h-6 w-6" />
        There&apos;s no document in this chat yet.
      </div>
    );
  }

  if (isLoadingUrl || !documentUrl) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl  text-sm text-muted-foreground">
        Loading document...
      </div>
    );
  }

  if (documentUrl.fileType === "pdf") {
    return <PdfViewer url={documentUrl.data.signedUrl} />;
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 rounded-xl  p-8 text-center">
      <FileText className="h-8 w-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        Preview isn&apos;t available for Word documents.
        <br />
        You can ask the AI about its content in the chat.
      </p>
    </div>
  );
}
