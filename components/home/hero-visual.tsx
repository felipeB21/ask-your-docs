import { FileText, Sparkles } from "lucide-react";

export function HeroVisual() {
  return (
    <div
      aria-hidden="true"
      className="group relative mx-auto w-full max-w-sm motion-safe:transition-transform motion-safe:duration-300 lg:mx-0 lg:hover:-translate-y-1"
    >
      <div className="-rotate-2 rounded-xl bg-card p-5 shadow-sm ring-1 ring-foreground/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-left-4 motion-safe:fill-mode-both motion-safe:duration-700 motion-safe:delay-500">
        <div className="flex items-center gap-2 text-xs font-mono tracking-wide text-muted-foreground uppercase">
          <FileText className="size-3.5" />
          quarterly-report.pdf
        </div>
        <div className="mt-3 space-y-2 text-sm text-muted-foreground">
          <p>Revenue growth was primarily driven by...</p>
          <p className="rounded-md bg-accent px-2 py-1 text-accent-foreground ring-1 ring-primary/30">
            ...a 34% increase in enterprise subscriptions during Q3, offsetting a slower start to the year.
          </p>
          <p>Operating margin held steady despite...</p>
        </div>
      </div>

      <div className="pointer-events-none absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full bg-background px-3 py-1 text-xs font-mono text-primary ring-1 ring-primary/30 motion-safe:animate-in motion-safe:fade-in motion-safe:fill-mode-both motion-safe:duration-500 motion-safe:delay-1000 lg:flex">
        <Sparkles className="size-3" />
        grounded in
      </div>

      <div className="mt-6 ml-auto rotate-1 rounded-xl bg-accent p-5 lg:mt-16 lg:w-[90%] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-4 motion-safe:fill-mode-both motion-safe:duration-700 motion-safe:delay-700">
        <div className="flex justify-end">
          <div className="max-w-[85%] rounded-lg bg-accent-foreground px-3 py-1.5 text-sm text-primary-foreground">
            What drove revenue growth this quarter?
          </div>
        </div>
        <p className="mt-3 text-sm text-foreground">
          Growth came mainly from a{" "}
          <span className="rounded bg-primary/15 px-1 font-medium text-accent-foreground">
            34% increase in enterprise subscriptions
          </span>{" "}
          in Q3.
        </p>
      </div>
    </div>
  );
}
