"use client";

import * as React from "react";
import {
  LifeBuoy,
  MessagesSquareIcon,
  Plus,
  Send,
  Settings2,
} from "lucide-react";

import { NavMain } from "./nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "../logo";
import { NavUser } from "./nav-user";
import { NavSecondary } from "./nav-secondary";
import { NavProjects } from "./nav-projects";
import { useChats } from "@/hooks/use-chats";

const navMain = [
  { title: "New Chat", url: "new", icon: Plus, isActive: true },
  { title: "Chats", url: "recents", icon: MessagesSquareIcon },
  { title: "Settings", url: "settings", icon: Settings2 },
];

const navSecondary = [
  { title: "Support", url: "#", icon: LifeBuoy },
  { title: "Feedback", url: "#", icon: Send },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null | undefined;
    createdAt: Date;
    updatedAt: Date;
  };
  plan: "free" | "pro";
}

export function AppSidebar({ user, plan, ...props }: AppSidebarProps) {
  const { data: chats, isLoading } = useChats();

  const chatItems = (chats ?? []).map((chat) => ({
    id: chat.id,
    name: chat.title,
    url: chat.id,
  }));

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="w-max p-2">
            <SidebarMenuButton render={<Logo />} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={chatItems} isLoading={isLoading} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} plan={plan} />
      </SidebarFooter>
    </Sidebar>
  );
}
