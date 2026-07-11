"use client";

import { usePathname } from "next/navigation";
import { useChats } from "@/hooks/use-chats";

export function ChatTitle() {
  const pathname = usePathname();
  const { data: chats } = useChats();

  const match = pathname.match(/^\/chat\/(.+)$/);
  if (!match) return null;

  const chatId = match[1];
  const chat = chats?.find((c) => c.id === chatId);

  if (!chat) return null;

  return <h1 className="text-sm font-medium truncate">{chat.title}</h1>;
}
