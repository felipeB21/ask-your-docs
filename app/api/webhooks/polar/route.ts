import { Webhooks } from "@polar-sh/nextjs";
import type { Subscription } from "@polar-sh/sdk/models/components/subscription.js";
import { syncSubscriptionFromPolar } from "@/lib/subscription";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onPayload: async (payload) => {
    if (!payload.type.startsWith("subscription.")) return;
    await syncSubscriptionFromPolar(payload.data as Subscription);
  },
});
