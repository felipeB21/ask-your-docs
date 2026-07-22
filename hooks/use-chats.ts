"use client";

import { useQuery } from "@tanstack/react-query";
import type { InferSelectModel } from "drizzle-orm";
import type { chats } from "@/db/schema";

export type Chat = InferSelectModel<typeof chats>;

async function fetchChats(): Promise<Chat[]> {
  const res = await fetch("/api/chats");
  if (!res.ok) throw new Error("Error loading the chats");
  return res.json();
}

export function useChats() {
  return useQuery({
    queryKey: ["chats"],
    queryFn: fetchChats,
  });
}
