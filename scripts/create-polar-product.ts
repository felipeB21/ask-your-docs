import "dotenv/config";
import { polar } from "../lib/polar";

async function main() {
  const product = await polar.products.create({
    name: "Pro",
    description: "Unlimited document uploads and AI messages.",
    recurringInterval: "month",
    prices: [
      {
        amountType: "fixed",
        priceAmount: 499,
        priceCurrency: "usd",
      },
    ],
  });

  console.log("Created product:", product.id);
  console.log("Set POLAR_PRO_PRODUCT_ID to this value in .env");
}

main();
