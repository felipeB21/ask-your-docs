"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { emailStepSchema } from "@/lib/auth-validation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const result = emailStepSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setLoading(true);
    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });
    setLoading(false);

    if (error) {
      setError(error.message ?? "Could not send the reset email.");
      return;
    }

    setSubmitted(true);
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6">
        {submitted ? (
          <div
            role="status"
            aria-live="polite"
            className="flex items-start gap-2 text-sm text-muted-foreground"
          >
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>
              If an account exists for <strong>{email}</strong>, we&apos;ve
              sent a link to reset your password.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? "email-error" : undefined}
                disabled={loading}
                autoFocus
              />
              {error && (
                <p id="email-error" role="alert" className="text-xs text-destructive">
                  {error}
                </p>
              )}
            </div>

            <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
