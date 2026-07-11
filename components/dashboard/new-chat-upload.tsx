"use client";

import { useRouter } from "next/navigation";
import { useUploadDocument } from "@/hooks/use-upload";
import { DocumentDropzone } from "./document-dropzone";

export function NewChatUpload() {
  const router = useRouter();
  const { mutate, isPending } = useUploadDocument();

  const handleFileSelected = (file: File) => {
    mutate(
      { file },
      {
        onSuccess: (data) => {
          router.push(`/chat/${data.chatId}`);
        },
      },
    );
  };

  return (
    <DocumentDropzone
      onFileSelected={handleFileSelected}
      isUploading={isPending}
    />
  );
}
