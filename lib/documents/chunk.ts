function splitLongParagraph(paragraph: string, maxSize: number): string[] {
  const result: string[] = [];
  let remaining = paragraph;

  while (remaining.length > maxSize) {
    const lastIndex = remaining.lastIndexOf(".", maxSize);
    const piece = remaining.slice(0, lastIndex + 1);
    const rest = remaining.slice(lastIndex + 1);

    result.push(piece);
    remaining = rest;
  }

  if (remaining.length > 0) {
    result.push(remaining);
  }

  return result;
}

export function chunkText(text: string, maxSize: number): string[] {
  const paragraphs = text.split("\n\n");
  const chunks: string[] = [];
  let actualChunk = "";

  for (const paragraph of paragraphs) {
    const totalSize = actualChunk.length + paragraph.length;

    if (totalSize < maxSize) {
      actualChunk += "\n\n" + paragraph;
    } else {
      if (actualChunk.length > 0) {
        chunks.push(actualChunk);
      }

      if (paragraph.length > maxSize) {
        const splitedLongParagraph = splitLongParagraph(paragraph, maxSize);
        chunks.push(...splitedLongParagraph);
        actualChunk = "";
      } else {
        actualChunk = paragraph;
      }
    }
  }

  if (actualChunk.length > 0) {
    chunks.push(actualChunk);
  }

  return chunks;
}
