"use client";

import { useQuery } from "@tanstack/react-query";

interface Document {
  fileType: "pdf" | "docx";
  data: {
    signedUrl: string;
  };
}

async function fetchDocumentUrl(documentId: string): Promise<Document> {
  const res = await fetch(`/api/documents/${documentId}/url`);
  if (!res.ok) throw new Error("Error loading the document");
  return res.json();
}

export function useDocumentUrl(id: string) {
  return useQuery<Document>({
    queryKey: ["document", id],
    queryFn: () => fetchDocumentUrl(id),
    enabled: !!id,
  });
}
