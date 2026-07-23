"use client";

import { MoreHorizontal, Star } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { ChatActionsMenu } from "./chat/chat-actions-menu";
import type { Chat } from "@/hooks/use-chats";

export function NavProjects({
  chats,
  isLoading,
}: {
  chats: Chat[];
  isLoading?: boolean;
}) {
  const { isMobile } = useSidebar();

  const sortedChats = [...chats].sort((a, b) =>
    a.isFavorite === b.isFavorite ? 0 : a.isFavorite ? -1 : 1,
  );

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Documents</SidebarGroupLabel>
      <SidebarMenu>
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <SidebarMenuItem key={i}>
                <SidebarMenuButton>
                  <Skeleton className="h-4 w-full" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          : sortedChats.map((chat) => (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton
                  render={
                    <Link href={`/chat/${chat.id}`}>
                      <span>{chat.title}</span>
                    </Link>
                  }
                />

                {chat.isFavorite && (
                  <SidebarMenuBadge className="group-hover/menu-item:hidden">
                    <Star className="size-3.5 fill-amber-500 text-amber-500" />
                  </SidebarMenuBadge>
                )}

                <ChatActionsMenu
                  chat={chat}
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                  trigger={
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  }
                />
              </SidebarMenuItem>
            ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
