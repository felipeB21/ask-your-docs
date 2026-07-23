"use client";

import clsx from "clsx";
import Markdown from "@/components/markdown";
import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMessages } from "@/hooks/use-messages";
import TextareaAutosize from "react-textarea-autosize";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";

export type ChatPanelHandle = {
  explainText: (text: string) => void;
};

const ChatPanel = forwardRef<ChatPanelHandle, { chatId: string }>(
  function ChatPanel({ chatId }, ref) {
    const [input, setInput] = useState("");
    const { data: history, isPending } = useMessages(chatId);
    const bottomRef = useRef<HTMLDivElement>(null);

    const transport = useMemo(
      () => new TextStreamChatTransport({ api: `/api/chats/${chatId}/messages` }),
      [chatId],
    );

    const { messages, sendMessage, setMessages, status, error } = useChat({
      transport,
    });

    const seededChatIdRef = useRef<string | null>(null);

    useEffect(() => {
      if (history && seededChatIdRef.current !== chatId) {
        seededChatIdRef.current = chatId;
        setMessages(
          history.map((m) => ({
            id: m.id,
            role: m.role === "ai" ? "assistant" : "user",
            parts: [{ type: "text", text: m.content ?? "" }],
          })),
        );
      }
    }, [history, chatId, setMessages]);

    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, status]);

    useImperativeHandle(ref, () => ({
      explainText: (text: string) => {
        sendMessage({
          text: `Explain the following excerpt from the document:\n\n"${text}"`,
        });
      },
    }));

    if (isPending) return null;

    return (
      <div className="flex flex-col h-full min-h-0 rounded-xl bg-accent">
        <div
          className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 text-sm chat-scroll"
          role="log"
          aria-live="polite"
        >
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground mt-10">
              Start the conversation by asking something.
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={clsx(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={clsx(
                  "rounded-lg whitespace-pre-wrap wrap-break-word text-pretty",
                  message.role === "user"
                    ? "bg-accent-foreground p-2 text-primary-foreground max-w-3/4"
                    : "",
                )}
              >
                {message.parts.map((part, i) =>
                  part.type === "text" ? (
                    <Markdown key={i} content={part.text} />
                  ) : null,
                )}
              </div>
            </div>
          ))}

          {status === "submitted" && (
            <div className="flex justify-start">
              <div className="rounded-lg px-2 py-1 text-muted-foreground animate-pulse">
                Thinking...
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-start">
              <div className="rounded-lg px-2 py-1 text-destructive">
                {error.message || "Something went wrong. Please try again."}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim()) return;
            sendMessage({ text: input });
            setInput("");
          }}
          className="shrink-0 border-t p-4"
        >
          <InputGroup>
            <TextareaAutosize
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Message"
              placeholder="Ask something about the document..."
              disabled={status === "streaming"}
              minRows={3}
              maxRows={6}
              className="w-full resize-none bg-transparent px-3 py-2 text-sm outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!input.trim()) return;
                  sendMessage({ text: input });
                  setInput("");
                }
              }}
            />
            <InputGroupAddon align="block-end" className="justify-end">
              <InputGroupButton
                type="submit"
                disabled={status === "streaming"}
                className="h-8 w-24"
                variant="default"
              >
                Send
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </div>
    );
  },
);

export default ChatPanel;
