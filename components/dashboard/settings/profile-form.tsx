"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function ProfileForm({ name }: { name: string }) {
  const router = useRouter();
  const [value, setValue] = useState(name);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = value.trim();
  const canSave = trimmed.length > 0 && trimmed !== name;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSave) return;

    setLoading(true);
    setError(null);
    const { error } = await authClient.updateUser({ name: trimmed });
    setLoading(false);

    if (error) {
      setError(error.message ?? "Could not update your name.");
      return;
    }
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Field>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <div className="flex w-full gap-2">
          <Input
            id="name"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={!canSave || loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : "Save"}
          </Button>
        </div>
      </Field>
      {error && <FieldError>{error}</FieldError>}
    </form>
  );
}
