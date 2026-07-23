"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import type { Chat } from "./use-chats";

interface UploadDocumentParams {
  file: File;
  chatId?: string;
}

async function uploadDocument({ file, chatId }: UploadDocumentParams) {
  const formData = new FormData();
  formData.append("file", file);

  const url = chatId
    ? `/api/chats/${chatId}/documents`
    : "/api/documents/upload";

  const res = await fetch(url, { method: "POST", body: formData });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "Error uploading the document");
  }
  return res.json();
}

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadDocument,
    onMutate: async ({ file, chatId }) => {
      if (chatId) return;

      await queryClient.cancelQueries({ queryKey: ["chats"] });

      const previousChats = queryClient.getQueryData(["chats"]);

      const optimisticChat = {
        id: nanoid(),
        title: file.name,
        userId: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      queryClient.setQueryData(["chats"], (old: Chat[] | undefined) => [
        optimisticChat,
        ...(old ?? []),
      ]);

      return { previousChats, optimisticChat };
    },
    onError: (err, variables, context) => {
      if (context?.previousChats) {
        queryClient.setQueryData(["chats"], context.previousChats);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}
