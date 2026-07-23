"use client";

import dynamic from "next/dynamic";
import { Inbox } from "lucide-react";
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

const DocxViewer = dynamic(() => import("./docx-viewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center rounded-xl  text-sm text-muted-foreground">
      Loading viewer...
    </div>
  ),
});

export default function DocumentViewer({
  chatId,
  onExplain,
}: {
  chatId: string;
  onExplain?: (text: string) => void;
}) {
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
    return <PdfViewer url={documentUrl.data.signedUrl} onExplain={onExplain} />;
  }

  return <DocxViewer key={document.id} url={documentUrl.data.signedUrl} />;
}
