import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { FREE_DOCUMENT_LIMIT, FREE_MESSAGE_LIMIT } from "@/lib/limits";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";

const PRICING_DESCRIPTION = `Simple, transparent pricing for ${SITE_NAME}. Start free with ${FREE_DOCUMENT_LIMIT} document uploads and ${FREE_MESSAGE_LIMIT} AI messages a day, or go unlimited on Pro for $4.99/month.`;
const PRICING_TITLE = `Pricing | ${SITE_NAME}`;

export const metadata: Metadata = {
  title: "Pricing",
  description: PRICING_DESCRIPTION,
  alternates: {
    canonical: "/pricing",
  },
  // openGraph/twitter don't deep-merge with the layout's defaults — repeat images here.
  openGraph: {
    url: `${SITE_URL}/pricing`,
    title: PRICING_TITLE,
    description: PRICING_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    title: PRICING_TITLE,
    description: PRICING_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs font-medium tracking-widest text-primary uppercase">
      {children}
    </p>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className="size-4 text-primary" />
      <span>{children}</span>
    </div>
  );
}

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Try it out, no card required.",
    features: [
      `${FREE_DOCUMENT_LIMIT} document uploads per day`,
      `${FREE_MESSAGE_LIMIT} AI messages per day`,
    ],
  },
  {
    name: "Pro",
    price: "$4.99",
    description: "For everyday use, without limits.",
    features: ["Unlimited document uploads", "Unlimited AI messages"],
    highlighted: true,
  },
];

export default function Pricing() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Pricing</Eyebrow>
          <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight md:text-4xl">
            Simple pricing, no surprises.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Start for free. Upgrade whenever the daily limits get in the way.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.highlighted ? "ring-2 ring-primary" : ""}
            >
              <CardContent className="space-y-4">
                <div>
                  <h2 className="text-lg font-medium">{plan.name}</h2>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
                <p className="font-serif text-3xl font-medium tracking-tight">
                  {plan.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    / month
                  </span>
                </p>
                <div className="space-y-2 text-sm">
                  {plan.features.map((feature) => (
                    <Feature key={feature}>{feature}</Feature>
                  ))}
                </div>
                <Link
                  href="/sign-up"
                  className={buttonVariants({
                    className: "w-full gap-2",
                    variant: plan.highlighted ? "default" : "outline",
                  })}
                >
                  Get started
                  <ArrowUpRight className="size-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
