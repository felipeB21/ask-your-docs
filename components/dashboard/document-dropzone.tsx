"use client";

import { useCallback, useState } from "react";
import { FileText, UploadCloud, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentDropzoneProps {
  onFileSelected: (file: File) => void;
  isUploading?: boolean;
  disabled?: boolean;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function DocumentDropzone({
  onFileSelected,
  isUploading,
  disabled,
}: DocumentDropzoneProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndSend = useCallback(
    (file: File | undefined) => {
      if (!file) return;

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Solo se aceptan archivos PDF o Word (.docx)");
        return;
      }

      setError(null);
      onFileSelected(file);
    },
    [onFileSelected],
  );

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (disabled || isUploading) return;
    validateAndSend(e.dataTransfer.files?.[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndSend(e.target.files?.[0]);
    e.target.value = ""; // permite volver a subir el mismo archivo si hace falta
  };

  return (
    <div className="w-full max-w-md">
      <label
        htmlFor="document-upload"
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled && !isUploading) setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
        className={cn(
          "group flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-8 py-14 text-center transition-colors",
          isDraggingOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/40",
          (disabled || isUploading) && "pointer-events-none opacity-60",
        )}
      >
        <input
          id="document-upload"
          type="file"
          accept=".pdf,.docx"
          className="sr-only"
          disabled={disabled || isUploading}
          onChange={handleChange}
        />

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-primary/10">
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : isDraggingOver ? (
            <UploadCloud className="h-5 w-5 text-primary" />
          ) : (
            <FileText className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium">
            {isUploading
              ? "Subiendo documento..."
              : isDraggingOver
                ? "Drop it here!"
                : "Drag and Drop a document or click to select"}
          </p>
          <p className="text-xs text-muted-foreground">
            PDF o Word · hasta 10 MB
          </p>
        </div>
      </label>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
