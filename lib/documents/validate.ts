import "server-only";

export const MAX_UPLOAD_SIZE_BYTES = 20 * 1024 * 1024;

type UploadValidationResult =
  | { fileType: "pdf" | "docx" }
  | { error: string };

export function validateUploadedFile(buffer: Buffer): UploadValidationResult {
  if (buffer.byteLength > MAX_UPLOAD_SIZE_BYTES) {
    return {
      error: `File is too large. Maximum size is ${MAX_UPLOAD_SIZE_BYTES / (1024 * 1024)}MB.`,
    };
  }

  const header = buffer.subarray(0, 4).toString("latin1");

  if (header === "%PDF") {
    return { fileType: "pdf" };
  }

  if (header === "PK\x03\x04") {
    return { fileType: "docx" };
  }

  return { error: "Unsupported file type. Please upload a PDF or DOCX file." };
}
