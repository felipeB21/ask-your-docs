"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { setTheme } from "@/app/(dashboard)/settings/actions";
import type { Theme } from "@/lib/theme";

export function ThemeSelector({ theme }: { theme: Theme }) {
  const router = useRouter();
  const [current, setCurrent] = useState(theme);
  const [isPending, startTransition] = useTransition();

  const handleSelect = (next: Theme) => {
    if (next === current) return;
    setCurrent(next);
    startTransition(async () => {
      await setTheme(next);
      router.refresh();
    });
  };

  return (
    <div className="inline-flex gap-1 rounded-lg bg-muted p-1">
      <Button
        type="button"
        size="sm"
        variant={current === "light" ? "default" : "ghost"}
        disabled={isPending}
        onClick={() => handleSelect("light")}
        className={cn(current !== "light" && "text-muted-foreground")}
      >
        <Sun />
        Light
      </Button>
      <Button
        type="button"
        size="sm"
        variant={current === "dark" ? "default" : "ghost"}
        disabled={isPending}
        onClick={() => handleSelect("dark")}
        className={cn(current !== "dark" && "text-muted-foreground")}
      >
        <Moon />
        Dark
      </Button>
    </div>
  );
}
