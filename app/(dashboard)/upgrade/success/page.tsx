import Link from "next/link";
import { requireUser } from "@/lib/session-helper";
import { polar } from "@/lib/polar";
import { syncSubscriptionFromPolar } from "@/lib/subscription";
import { Button } from "@/components/ui/button";
import { SuccessCheckmark } from "@/components/dashboard/success-checkmark";

async function activateSubscription(userId: string, checkoutId: string) {
  try {
    const checkout = await polar.checkouts.get({ id: checkoutId });
    if (checkout.externalCustomerId !== userId || checkout.status !== "succeeded") {
      return;
    }

    // Checkout objects don't link forward to the subscription they created,
    // so look it up by customer instead and match it back to this checkout.
    const { result } = await polar.subscriptions.list({
      externalCustomerId: [userId],
      sorting: ["-started_at"],
      limit: 10,
    });
    const subscription =
      result.items.find((item) => item.checkoutId === checkoutId) ??
      result.items[0];

    if (subscription) {
      await syncSubscriptionFromPolar(subscription);
    }
  } catch (error) {
    console.error("Failed to sync subscription after checkout:", error);
  }
}

export default async function UpgradeSuccess({
  searchParams,
}: {
  searchParams: Promise<{ checkout_id?: string }>;
}) {
  const user = await requireUser();
  const { checkout_id } = await searchParams;

  if (checkout_id) {
    await activateSubscription(user.id, checkout_id);
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 py-24 text-center">
      <SuccessCheckmark />

      <div className="space-y-1 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-500 motion-safe:delay-150">
        <h1 className="text-2xl font-semibold tracking-tight">
          You&apos;re on Pro
        </h1>
        <p className="text-muted-foreground text-sm">
          Unlimited document uploads and AI messages are now unlocked.
        </p>
      </div>

      <div className="flex gap-3 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500 motion-safe:delay-300">
        <Button nativeButton={false} render={<Link href="/new" />}>
          Start a new chat
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/upgrade" />}
        >
          View plan
        </Button>
      </div>
    </div>
  );
}
