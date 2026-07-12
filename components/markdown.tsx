"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

type MarkdownProps = {
  content: string | null;
};

export default function Markdown({ content }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        h1: ({ children }) => <h1 className="font-bold">{children}</h1>,
        h2: ({ children }) => <h2 className="font-semibold">{children}</h2>,
        h3: ({ children }) => <h3 className="font-semibold">{children}</h3>,
        p: ({ children }) => <p>{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-6 ">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6">{children}</ol>,
        li: ({ children }) => <li>{children}</li>,
        strong: ({ children }) => (
          <strong className="font-semibold">{children}</strong>
        ),
        code({ className, children, ...props }) {
          const isBlock = className?.startsWith("language-");

          if (isBlock) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }

          return (
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm" {...props}>
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="my-4 overflow-x-auto rounded-lg bg-zinc-900 p-4">
            {children}
          </pre>
        ),
      }}
    >
      {content ?? ""}
    </ReactMarkdown>
  );
}
