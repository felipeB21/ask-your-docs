import "dotenv/config";
import { generateEmbedding } from "../lib/documents/embed";

async function main() {
  const embedding = await generateEmbedding("Hola mundo, esto es una prueba.");
  console.log("Cantidad de dimensiones:", embedding.length);
  console.log("Primeros 5 valores:", embedding.slice(0, 5));
}

main();
