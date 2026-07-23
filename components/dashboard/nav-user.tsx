"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import type { LimitCheck } from "@/lib/limits";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface Notification {
  id: string;
  message: string;
  tone: "alert" | "info";
}

export function NavUser({
  user,
  plan,
  documentLimit,
  messageLimit,
}: {
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
  documentLimit: LimitCheck;
  messageLimit: LimitCheck;
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const notifications: Notification[] = [];
  if (!documentLimit.allowed) {
    notifications.push({
      id: "document-limit",
      tone: "alert",
      message: `You've reached today's limit of ${documentLimit.limit} document uploads. Upgrade to Pro for unlimited uploads.`,
    });
  }
  if (!messageLimit.allowed) {
    notifications.push({
      id: "message-limit",
      tone: "alert",
      message: `You've reached today's limit of ${messageLimit.limit} AI messages. Upgrade to Pro for unlimited messages.`,
    });
  }
  if (plan === "pro") {
    notifications.push({
      id: "pro-active",
      tone: "info",
      message: "You're on the Pro plan — unlimited uploads and messages are active.",
    });
  }

  const hasAlerts = notifications.some((notification) => notification.tone === "alert");

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
    } finally {
      setIsLoggingOut(false);
    }
    router.push("/");
    router.refresh();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.image ?? undefined} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                {hasAlerts && (
                  <span
                    className="size-2 shrink-0 rounded-full bg-destructive"
                    aria-hidden
                  />
                )}
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            }
          />

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.image ?? undefined} alt={user.name} />
                    <AvatarFallback className="rounded-lg">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link href="/upgrade" />}>
                <Sparkles />
                {plan === "pro" ? "Manage plan" : "Upgrade to Pro"}
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link href="/settings" />}>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/upgrade" />}>
                <CreditCard />
                Billing
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Bell />
                  <span className="flex items-center gap-1.5">
                    Notifications
                    {hasAlerts && (
                      <span
                        className="size-1.5 rounded-full bg-destructive"
                        aria-hidden
                      />
                    )}
                  </span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-72">
                  {notifications.length === 0 ? (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      You&apos;re all caught up.
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={
                          notification.tone === "alert"
                            ? "px-2 py-1.5 text-sm text-pretty text-destructive"
                            : "px-2 py-1.5 text-sm text-pretty text-muted-foreground"
                        }
                      >
                        {notification.message}
                      </div>
                    ))
                  )}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              disabled={isLoggingOut}
              onClick={handleLogout}
            >
              <LogOut />
              {isLoggingOut ? "Logging out..." : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
