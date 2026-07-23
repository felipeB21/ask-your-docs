import { NextResponse } from "next/server";
import { getSession } from "@/lib/session-helper";
import { polar } from "@/lib/polar";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const productId = process.env.POLAR_PRO_PRODUCT_ID;
    if (!productId) {
      return NextResponse.json(
        { error: "Missing Polar product configuration" },
        { status: 500 },
      );
    }

    const origin = new URL(req.url).origin;

    const checkout = await polar.checkouts.create({
      products: [productId],
      externalCustomerId: session.user.id,
      successUrl: `${origin}/upgrade/success?checkout_id={CHECKOUT_ID}`,
    });

    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creating the checkout session" },
      { status: 500 },
    );
  }
}
