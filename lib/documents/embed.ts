import { embed } from "ai";
import { google } from "@ai-sdk/google";

export async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: google.embeddingModel("gemini-embedding-001"),
    value: text,
    providerOptions: {
      google: {
        outputDimensionality: 768,
      },
    },
  });

  return embedding;
}
