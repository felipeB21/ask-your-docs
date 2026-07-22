import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
  KeyRound,
  Layers,
  MessagesSquare,
  Search,
  Sparkles,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { HeroVisual } from "@/components/home/hero-visual";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs font-medium tracking-widest text-primary uppercase">
      {children}
    </p>
  );
}

const steps = [
  {
    number: "01",
    title: "Upload",
    description:
      "Drop in a PDF or DOCX. We extract and chunk the text, paragraph by paragraph, so nothing gets cut mid-thought.",
  },
  {
    number: "02",
    title: "Ask",
    description:
      "Ask a question the way you'd ask a person. Your question is matched against the most relevant passages in your document.",
  },
  {
    number: "03",
    title: "Get a grounded answer",
    description:
      "The AI answers using only what's actually in your document — and you can keep going, across every file you've added to that chat.",
  },
];

const capabilities = [
  {
    icon: FileText,
    title: "PDF & DOCX support",
    description:
      "Upload either format — extraction and chunking are handled automatically before you ask a single question.",
  },
  {
    icon: Search,
    title: "Grounded, similarity-based answers",
    description:
      "Every answer is matched against the passages your question actually relates to, scoped to the current chat only.",
  },
  {
    icon: Layers,
    title: "Multiple documents, one chat",
    description:
      "Add several files to the same chat and ask questions that draw on all of them together.",
  },
  {
    icon: MessagesSquare,
    title: "A real conversation",
    description:
      "Follow up, rephrase, go deeper — the chat keeps context as you go.",
  },
  {
    icon: KeyRound,
    title: "Flexible sign-in",
    description:
      "Sign in with email and password, or continue with Google or GitHub.",
  },
  {
    icon: Sparkles,
    title: "Precise, meaning-based matching",
    description:
      "Documents are embedded with Google's Gemini embedding model, so retrieval is based on meaning, not just keywords.",
  },
];

export default function Home() {
  return (
    <>
      <section id="hero" className="bg-accent">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 pt-36 pb-20 md:px-10 md:pt-44 md:pb-28 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-both motion-safe:duration-500">
              <Eyebrow>AI-powered document Q&amp;A</Eyebrow>
            </div>
            <h1 className="mt-4 max-w-xl font-serif text-4xl font-medium tracking-tight text-balance motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-both motion-safe:duration-500 motion-safe:delay-100 md:text-5xl xl:text-6xl">
              Your documents, finally worth{" "}
              <span className="text-primary">talking to</span>.
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground text-pretty motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-both motion-safe:duration-500 motion-safe:delay-200">
              Upload a PDF or Word doc and ask it anything. AskYourDocs reads
              it, finds the exact passages that matter, and answers in plain
              language — grounded in your document, not a guess.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-both motion-safe:duration-500 motion-safe:delay-300 sm:flex-row">
              <Link
                href="/sign-up"
                className={buttonVariants({ size: "lg", className: "gap-2" })}
              >
                Get started free
                <ArrowUpRight className="size-4" />
              </Link>
              <Link
                href="#how-it-works"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                See how it works
              </Link>
            </div>
          </div>

          <HeroVisual />
        </div>
      </section>

      <section id="how-it-works" className="bg-background">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
          <div className="max-w-2xl">
            <Eyebrow>The process</Eyebrow>
            <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight md:text-4xl">
              Three steps from PDF to answer.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <Card key={step.number}>
                <CardContent className="space-y-3">
                  <span className="font-mono text-4xl text-primary/30">
                    {step.number}
                  </span>
                  <h3 className="text-base font-medium">{step.title}</h3>
                  <CardDescription>{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="capabilities" className="bg-background">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
          <div className="max-w-2xl">
            <Eyebrow>What you get</Eyebrow>
            <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight md:text-4xl">
              Built to actually read your documents.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability) => (
              <Card key={capability.title}>
                <CardContent className="space-y-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <capability.icon className="size-4" />
                  </div>
                  <h3 className="text-base font-medium">{capability.title}</h3>
                  <CardDescription>{capability.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="get-started" className="bg-foreground text-background">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center md:px-10 md:py-28">
          <h2 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
            Stop skimming. Start asking.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-background/70">
            Free to start — upload your first document and get an answer in
            under a minute.
          </p>
          <Link
            href="/sign-up"
            className={buttonVariants({
              size: "lg",
              className: "mt-8 gap-2 bg-background text-foreground hover:bg-background/90",
            })}
          >
            Get started free
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
