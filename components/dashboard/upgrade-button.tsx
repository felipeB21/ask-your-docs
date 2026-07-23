"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function UpgradeButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "Error starting checkout");
      window.location.href = body.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error starting checkout");
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Redirecting..." : "Upgrade to Pro"}
      </Button>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
