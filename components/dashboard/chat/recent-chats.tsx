"use client";
import { MoreHorizontal, Star } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useChats } from "@/hooks/use-chats";
import Link from "next/link";
import { ChatActionsMenu } from "./chat-actions-menu";

export default function RecentChats() {
  const { data: chats, isLoading } = useChats();

  const sortedChats = [...(chats ?? [])].sort((a, b) =>
    a.isFavorite === b.isFavorite ? 0 : a.isFavorite ? -1 : 1,
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-medium">Chats</h1>
        <Link href="/new" className={buttonVariants()}>
          New conversation
        </Link>
      </div>
      <Input className="my-5" placeholder="Search documents..." />
      <ul className="flex flex-col">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <SidebarMenuItem key={i}>
                <Skeleton className="h-12 w-full my-2" />
              </SidebarMenuItem>
            ))
          : sortedChats.map((chat) => (
              <li
                key={chat.id}
                className="group flex h-14 items-center gap-2 border-b"
              >
                <Link
                  href={`/chat/${chat.id}`}
                  className={`${buttonVariants({
                    variant: "ghost",
                    size: "lg",
                  })} h-14 flex-1 justify-start`}
                >
                  {chat.isFavorite && (
                    <Star className="size-3.5 shrink-0 fill-amber-500 text-amber-500" />
                  )}
                  <span className="truncate">{chat.title}</span>
                </Link>

                <ChatActionsMenu
                  chat={chat}
                  align="end"
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 opacity-0 focus-visible:opacity-100 group-hover:opacity-100"
                    >
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </Button>
                  }
                />
              </li>
            ))}
      </ul>
    </div>
  );
}
