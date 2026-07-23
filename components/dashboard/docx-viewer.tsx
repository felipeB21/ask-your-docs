"use client";

import { useEffect, useState } from "react";
import mammoth from "mammoth";
import { Loader2, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DocxViewer({ url }: { url: string }) {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [scale, setScale] = useState(1);

  const zoomOut = () => setScale((s) => Math.max(0.6, s - 0.1));
  const zoomIn = () => setScale((s) => Math.min(1.5, s + 0.1));

  useEffect(() => {
    let cancelled = false;

    fetch(url)
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => mammoth.convertToHtml({ arrayBuffer }))
      .then((result) => {
        if (!cancelled) setHtml(result.value);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl">
      <div className="flex flex-1 min-h-0 items-start justify-center overflow-y-auto p-4 chat-scroll">
        {error ? (
          <p className="pt-8 text-sm text-muted-foreground">
            Could not load the document.
          </p>
        ) : !html ? (
          <div className="flex items-center gap-2 pt-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading document...
          </div>
        ) : (
          <div
            className="docx-page origin-top rounded-sm bg-white p-12 text-neutral-900 shadow-md"
            style={{
              width: "8.5in",
              transform: `scale(${scale})`,
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>

      <div className="flex shrink-0 items-center justify-between border-t px-4 py-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={zoomOut}
            disabled={scale <= 0.6}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={zoomIn}
            disabled={scale >= 1.5}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        <div className="w-16" />
      </div>
    </div>
  );
}
