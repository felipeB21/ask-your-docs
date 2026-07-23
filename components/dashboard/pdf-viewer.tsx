"use client";

import { useEffect, useRef, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type SelectionTooltip = {
  text: string;
  top: number;
  left: number;
};

export default function PdfViewer({
  url,
  onExplain,
}: {
  url: string;
  onExplain?: (text: string) => void;
}) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [selection, setSelection] = useState<SelectionTooltip | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function onLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const goToPrevPage = () => setPageNumber((p) => Math.max(1, p - 1));
  const goToNextPage = () =>
    setPageNumber((p) => Math.min(numPages ?? p, p + 1));
  const zoomOut = () => setScale((s) => Math.max(0.6, s - 0.2));
  const zoomIn = () => setScale((s) => Math.min(2, s + 0.2));

  const handleTextSelection = () => {
    const windowSelection = window.getSelection();
    const text = windowSelection?.toString().trim();
    const container = containerRef.current;

    if (!windowSelection || !text || windowSelection.rangeCount === 0 || !container) {
      setSelection(null);
      return;
    }

    const range = windowSelection.getRangeAt(0);
    if (!container.contains(range.commonAncestorContainer)) {
      setSelection(null);
      return;
    }

    const rangeRect = range.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    setSelection({
      text,
      top: rangeRect.top - containerRect.top + container.scrollTop,
      left:
        rangeRect.left -
        containerRect.left +
        container.scrollLeft +
        rangeRect.width / 2,
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const clearSelection = () => setSelection(null);
    container.addEventListener("scroll", clearSelection);
    return () => container.removeEventListener("scroll", clearSelection);
  }, []);

  const handleExplainClick = () => {
    if (!selection) return;
    onExplain?.(selection.text);
    window.getSelection()?.removeAllRanges();
    setSelection(null);
  };

  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl">
      <div
        ref={containerRef}
        className="relative flex flex-1 min-h-0 items-center justify-center overflow-y-auto p-4 chat-scroll"
        onMouseUp={handleTextSelection}
      >
        {selection && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleExplainClick}
            style={{
              top: selection.top,
              left: selection.left,
              transform: "translate(-50%, calc(-100% - 8px))",
            }}
            className="absolute z-10 flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium whitespace-nowrap text-primary-foreground shadow-md hover:bg-primary/90"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Explain with AI
          </button>
        )}
        <Document
          file={url}
          onLoadSuccess={onLoadSuccess}
          loading={
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading document...
            </div>
          }
          error={
            <p className="text-sm text-muted-foreground">
              Could not load the document.
            </p>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            className="shadow-md"
            renderAnnotationLayer
            renderTextLayer
          />
        </Document>
      </div>

      <div className="flex shrink-0 items-center justify-between border-t px-4 py-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={zoomOut}
            disabled={scale <= 0.6}
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={zoomIn}
            disabled={scale >= 2}
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="tabular-nums">
            {pageNumber} / {numPages ?? "-"}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={goToNextPage}
            disabled={!numPages || pageNumber >= numPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-16" />
      </div>
    </div>
  );
}
