"use client";

import { useMessages } from "@/hooks/use-messages";
import Image from "next/image";
import clsx from "clsx";
import Markdown from "@/components/markdown";

export default function ChatPanel({ chatId }: { chatId: string }) {
  const { data: messages, isPending } = useMessages(chatId);

  if (isPending) {
    return (
      <div className="h-full flex items-center justify-center">Loading...</div>
    );
  }

  return (
    <div className="flex flex-col h-max rounded-xl bg-accent ">
      <div className="border-b border-border p-5 flex items-center gap-3">
        <Image src="/icon.svg" alt="AI" width={22} height={22} />

        <div>
          <h2 className="font-semibold">AskYourDocs</h2>
          <p className="text-sm text-muted-foreground">
            How can i help you with?
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
        {messages?.length === 0 && (
          <div className="text-center text-muted-foreground mt-10">
            Start the conversation by asking something.
          </div>
        )}

        {messages?.map((message) => (
          <div
            key={message.id}
            className={clsx(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={clsx(
                "rounded-lg whitespace-pre-wrap wrap-break-word",
                message.role === "user"
                  ? "bg-accent-foreground p-2 text-primary-foreground"
                  : "",
              )}
            >
              <Markdown content={message.content} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
