"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

interface UpdateChatParams {
  chatId: string;
  title?: string;
  isFavorite?: boolean;
}

async function updateChat({ chatId, title, isFavorite }: UpdateChatParams) {
  const res = await fetch(`/api/chats/${chatId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, isFavorite }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "Error updating the chat");
  }
  return res.json();
}

export function useUpdateChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateChat,
    onMutate: async ({ chatId, title, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: ["chats"] });

      const previousChats = queryClient.getQueryData<Chat[]>(["chats"]);

      queryClient.setQueryData(["chats"], (old: Chat[] | undefined) =>
        old?.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                ...(title !== undefined && { title }),
                ...(isFavorite !== undefined && { isFavorite }),
              }
            : chat,
        ),
      );

      return { previousChats };
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

async function deleteChat(chatId: string) {
  const res = await fetch(`/api/chats/${chatId}`, { method: "DELETE" });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "Error deleting the chat");
  }
  return res.json();
}

export function useDeleteChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteChat,
    onMutate: async (chatId: string) => {
      await queryClient.cancelQueries({ queryKey: ["chats"] });

      const previousChats = queryClient.getQueryData<Chat[]>(["chats"]);

      queryClient.setQueryData(["chats"], (old: Chat[] | undefined) =>
        old?.filter((chat) => chat.id !== chatId),
      );

      return { previousChats };
    },
    onError: (err, chatId, context) => {
      if (context?.previousChats) {
        queryClient.setQueryData(["chats"], context.previousChats);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}
