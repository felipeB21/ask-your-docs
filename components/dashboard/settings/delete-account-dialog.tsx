"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const CONFIRM_WORD = "DELETE";

export function DeleteAccountDialog({ hasPassword }: { hasPassword: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDelete =
    confirmText === CONFIRM_WORD && (!hasPassword || password.length > 0);

  const reset = () => {
    setPassword("");
    setConfirmText("");
    setError(null);
  };

  const handleOpenChange = (next: boolean) => {
    if (!loading) {
      setOpen(next);
      if (!next) reset();
    }
  };

  const handleDelete = async () => {
    if (!canDelete) return;

    setLoading(true);
    setError(null);
    const { error } = await authClient.deleteUser({
      ...(hasPassword ? { password } : {}),
    });
    setLoading(false);

    if (error) {
      setError(error.message ?? "Could not delete your account.");
      return;
    }

    router.push("/");
  };

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        onClick={() => setOpen(true)}
        className="w-fit"
      >
        Delete account
      </Button>

      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes your account, and every chat, document,
              and message you have. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <FieldGroup>
            {hasPassword && (
              <Field>
                <FieldLabel htmlFor="delete-password">Password</FieldLabel>
                <Input
                  id="delete-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={loading}
                />
              </Field>
            )}
            <Field>
              <FieldLabel htmlFor="delete-confirm">
                Type {CONFIRM_WORD} to confirm
              </FieldLabel>
              <Input
                id="delete-confirm"
                value={confirmText}
                onChange={(event) => setConfirmText(event.target.value)}
                disabled={loading}
                autoComplete="off"
              />
            </Field>
          </FieldGroup>
          {error && <FieldError>{error}</FieldError>}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={!canDelete || loading}
              onClick={handleDelete}
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Delete account"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
