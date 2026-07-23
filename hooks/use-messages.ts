"use client";

import { useQuery } from "@tanstack/react-query";
import type { InferSelectModel } from "drizzle-orm";
import type { messages } from "@/db/schema";

export type Message = InferSelectModel<typeof messages>;

async function fetchChat(chatId: string): Promise<Message[]> {
  const res = await fetch(`/api/chats/${chatId}/messages`);

  if (!res.ok) {
    throw new Error("Error loading the chat");
  }

  return res.json();
}

export function useMessages(chatId: string) {
  return useQuery<Message[]>({
    queryKey: ["messages", chatId],
    queryFn: () => fetchChat(chatId),
    staleTime: 30_000,
  });
}
