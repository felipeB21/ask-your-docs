import { CheckCircle2 } from "lucide-react";
import { requireUser } from "@/lib/session-helper";
import { getSubscription, isProStatus } from "@/lib/subscription";
import { FREE_DOCUMENT_LIMIT, FREE_MESSAGE_LIMIT } from "@/lib/limits";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UpgradeButton } from "@/components/dashboard/upgrade-button";

export default async function Upgrade() {
  const user = await requireUser();
  const subscription = await getSubscription(user.id);
  const isPro = isProStatus(subscription?.status);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 py-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Plan</h1>
        <p className="text-muted-foreground text-sm">
          {isPro
            ? "You're on the Pro plan — enjoy unlimited documents and AI messages."
            : "You're on the Free plan. Upgrade to Pro for unlimited documents and AI messages."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className={isPro ? "opacity-60" : ""}>
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>$0 / month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Feature>{FREE_DOCUMENT_LIMIT} document uploads per day</Feature>
            <Feature>{FREE_MESSAGE_LIMIT} AI messages per day</Feature>
          </CardContent>
        </Card>

        <Card className={isPro ? "ring-2 ring-primary" : ""}>
          <CardHeader>
            <CardTitle>Pro</CardTitle>
            <CardDescription>$4.99 / month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Feature>Unlimited document uploads</Feature>
            <Feature>Unlimited AI messages</Feature>
          </CardContent>
          <CardFooter>
            {isPro ? (
              <Button
                variant="outline"
                nativeButton={false}
                render={<a href="/api/portal" />}
              >
                Manage billing
              </Button>
            ) : (
              <UpgradeButton />
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className="size-4 text-primary" />
      <span>{children}</span>
    </div>
  );
}
