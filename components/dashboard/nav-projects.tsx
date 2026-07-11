"use client";

import { MoreHorizontal, Pencil, Star, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

export function NavProjects({
  projects,
  isLoading,
}: {
  projects: {
    id: string;
    name: string;
    url: string;
  }[];
  isLoading?: boolean;
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <SidebarMenuItem key={i}>
                <SidebarMenuButton>
                  <Skeleton className="h-4 w-full" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          : projects.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  render={
                    <Link href={`/chat/${item.url}`}>
                      <span>{item.name}</span>
                    </Link>
                  }
                />

                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    }
                  />

                  <DropdownMenuContent
                    className="w-48"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem>
                      <Star className="text-muted-foreground" />
                      <span>Highlight</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pencil className="text-muted-foreground" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      <Trash2 className="text-muted-foreground" />
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
