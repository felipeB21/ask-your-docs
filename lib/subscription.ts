import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import type { Subscription } from "@polar-sh/sdk/models/components/subscription.js";

export async function getSubscription(userId: string) {
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId));
  return subscription ?? null;
}

export function isProStatus(status: string | null | undefined) {
  return status === "active" || status === "trialing";
}

export async function syncSubscriptionFromPolar(subscription: Subscription) {
  const userId = subscription.customer.externalId;
  if (!userId) return;

  const values = {
    userId,
    polarCustomerId: subscription.customerId,
    polarSubscriptionId: subscription.id,
    status: subscription.status,
    currentPeriodEnd: subscription.currentPeriodEnd,
  };

  const existing = await getSubscription(userId);

  if (existing) {
    await db
      .update(subscriptions)
      .set(values)
      .where(eq(subscriptions.userId, userId));
  } else {
    await db.insert(subscriptions).values({ id: nanoid(), ...values });
  }
}
