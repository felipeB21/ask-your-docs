import Link from "next/link";
import { BadgeCheck } from "lucide-react";

import { requireUser } from "@/lib/session-helper";
import { getSubscription, isProStatus } from "@/lib/subscription";
import { hasPasswordAccount } from "@/lib/account";
import { getTheme } from "@/lib/theme";
import { getInitials } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileForm } from "@/components/dashboard/settings/profile-form";
import { ThemeSelector } from "@/components/dashboard/settings/theme-selector";
import { ChangePasswordForm } from "@/components/dashboard/settings/change-password-form";
import { DeleteAccountDialog } from "@/components/dashboard/settings/delete-account-dialog";

export default async function Settings() {
  const user = await requireUser();
  const [subscription, hasPassword, theme] = await Promise.all([
    getSubscription(user.id),
    hasPasswordAccount(user.id),
    getTheme(),
  ]);
  const isPro = isProStatus(subscription?.status);
  const memberSince = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(user.createdAt);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 py-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your profile, appearance, and account.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Your personal information and plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              <AvatarImage src={user.image ?? undefined} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5 text-sm">
              <div className="flex items-center gap-1.5 font-medium">
                {user.email}
                {user.emailVerified && (
                  <BadgeCheck className="size-4 text-primary" />
                )}
              </div>
              <span className="text-muted-foreground">
                Member since {memberSince} ·{" "}
                <Link href="/upgrade" className="hover:text-foreground hover:underline">
                  {isPro ? "Pro plan" : "Free plan"}
                </Link>
              </span>
            </div>
          </div>

          <ProfileForm name={user.name} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose how the app looks on this device.</CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeSelector theme={theme} />
        </CardContent>
      </Card>

      {hasPassword && (
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Update the password used to sign in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      )}

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
          <CardDescription>
            Permanently delete your account and all of its data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteAccountDialog hasPassword={hasPassword} />
        </CardContent>
      </Card>
    </div>
  );
}
