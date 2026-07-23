"use client";

import { useQuery } from "@tanstack/react-query";
import { documents } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type Documents = InferSelectModel<typeof documents>;

async function fetchChatDocument(chatId: string): Promise<Documents[]> {
  const res = await fetch(`/api/chats/${chatId}/documents`);
  if (!res.ok) throw new Error("Error loading the document");
  const { data } = await res.json();
  return data;
}

export function useChatDocument(chatId: string) {
  return useQuery<Documents[]>({
    queryKey: ["documents", chatId],
    queryFn: () => fetchChatDocument(chatId),
    staleTime: 30_000,
  });
}
