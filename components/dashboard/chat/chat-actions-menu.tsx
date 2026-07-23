"use client";

import { useState, type ReactElement } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Pencil, Star, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Chat } from "@/hooks/use-chats";
import { useDeleteChat, useUpdateChat } from "@/hooks/use-chats";

export function ChatActionsMenu({
  chat,
  trigger,
  side,
  align,
}: {
  chat: Chat;
  trigger: ReactElement;
  side?: "bottom" | "right";
  align?: "start" | "end";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const updateChat = useUpdateChat();
  const deleteChat = useDeleteChat();

  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [title, setTitle] = useState(chat.title);

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (trimmed && trimmed !== chat.title) {
      updateChat.mutate({ chatId: chat.id, title: trimmed });
    }
    setRenameOpen(false);
  };

  const handleToggleFavorite = () => {
    updateChat.mutate({ chatId: chat.id, isFavorite: !chat.isFavorite });
  };

  const handleDelete = () => {
    deleteChat.mutate(chat.id);
    setDeleteOpen(false);
    if (pathname === `/chat/${chat.id}`) {
      router.push("/new");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={trigger} />
        <DropdownMenuContent className="w-48" side={side} align={align}>
          <DropdownMenuItem onClick={handleToggleFavorite}>
            <Star
              className={cn(
                chat.isFavorite
                  ? "fill-amber-500 text-amber-500"
                  : "text-muted-foreground",
              )}
            />
            <span>
              {chat.isFavorite ? "Remove from favorites" : "Add to favorites"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setTitle(chat.title);
              setRenameOpen(true);
            }}
          >
            <Pencil className="text-muted-foreground" />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="text-muted-foreground" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <form onSubmit={handleRenameSubmit}>
            <DialogHeader>
              <DialogTitle>Rename chat</DialogTitle>
            </DialogHeader>
            <FieldGroup className="py-4">
              <Field>
                <FieldLabel htmlFor={`rename-${chat.id}`}>Name</FieldLabel>
                <Input
                  id={`rename-${chat.id}`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <Button type="submit" disabled={!title.trim()}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &ldquo;{chat.title}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this chat and its uploaded
              document. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
