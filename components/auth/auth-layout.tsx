import type { ReactNode } from "react";
import { Quote } from "lucide-react";
import Logo from "../logo";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-2">
      <aside className="relative hidden bg-foreground lg:block">
        <div className="absolute inset-0 flex flex-col justify-between p-10 text-background">
          <Logo />

          <figure className="max-w-md">
            <Quote className="mb-3 size-6 text-primary" />
            <blockquote className="text-pretty text-xl font-medium leading-relaxed">
              Chat with any document and get instant answers, summaries, and
              citations from your PDFs.
            </blockquote>
            <figcaption className="mt-4 text-sm text-background/80">
              Turn hundreds of pages into a conversation.
            </figcaption>
          </figure>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm lg:hidden">
              <Logo />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-balance">
              {title}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
              {subtitle}
            </p>
          </div>

          {children}

          <p className="mt-6 text-center text-sm text-muted-foreground lg:text-left">
            {footer}
          </p>
        </div>
      </div>
    </main>
  );
}
