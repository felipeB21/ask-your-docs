"use client";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useChats } from "@/hooks/use-chats";
import Link from "next/link";

export default function RecentChats() {
  const { data: chats, isLoading } = useChats();

  const chatItems = (chats ?? []).map((chat) => ({
    id: chat.id,
    name: chat.title,
    url: chat.id,
  }));

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-medium">Chats</h1>
        <Link href="/" className={buttonVariants()}>
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
          : chatItems.map((chat) => (
              <Link
                href={`/chat/${chat.id}`}
                key={chat.id}
                className={`${buttonVariants({
                  variant: "ghost",
                  size: "lg",
                })} flex justify-start h-14 border-b`}
              >
                <span>{chat.name}</span>
              </Link>
            ))}
      </ul>
    </div>
  );
}
