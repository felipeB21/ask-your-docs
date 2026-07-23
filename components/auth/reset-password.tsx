"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, CheckCircle2, Eye, EyeOff, Loader2, X } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { passwordRules, passwordSchema } from "@/lib/auth-validation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function ResetPasswordForm({ token }: { token?: string }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError("This reset link is invalid or has expired.");
      return;
    }

    const result = passwordSchema.safeParse(password);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setLoading(true);
    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
    });
    setLoading(false);

    if (error) {
      setError(error.message ?? "Could not reset your password.");
      return;
    }

    setDone(true);
  }

  if (!token) {
    return (
      <Card className="shadow-sm">
        <CardContent className="flex flex-col gap-4 pt-6">
          <p className="text-sm text-muted-foreground">
            This reset link is invalid or has expired.
          </p>
          <Button
            size="lg"
            className="w-full"
            nativeButton={false}
            render={<Link href="/forgot-password" />}
          >
            Request a new link
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (done) {
    return (
      <Card className="shadow-sm">
        <CardContent className="flex flex-col gap-4 pt-6">
          <div
            role="status"
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <CheckCircle2 className="size-4 text-primary" />
            Your password has been updated.
          </div>
          <Button
            size="lg"
            className="w-full"
            nativeButton={false}
            render={<Link href="/sign-in" />}
          >
            Continue to sign in
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">New password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a new password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={!!error}
                aria-describedby="password-rules"
                disabled={loading}
                className="pr-9"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>

            <ul id="password-rules" aria-live="polite" className="mt-1 flex flex-col gap-1">
              {passwordRules.map((rule) => {
                const passed = rule.test(password);
                return (
                  <li
                    key={rule.label}
                    className={cn(
                      "flex items-center gap-1.5 text-xs",
                      passed ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {passed ? (
                      <Check className="size-3.5" />
                    ) : (
                      <X className="size-3.5" />
                    )}
                    {rule.label}
                  </li>
                );
              })}
            </ul>
          </div>

          {error && (
            <p role="alert" className="text-xs text-destructive">
              {error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="mt-2 w-full"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Reset password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
