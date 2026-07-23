import { Mail, MessageSquareText, Upload } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/seo";

const SUPPORT_EMAIL = "bolgarfelipe@gmail.com";

const steps = [
  {
    icon: MessageSquareText,
    title: "Start a chat",
    description: "Create a new chat from the sidebar.",
  },
  {
    icon: Upload,
    title: "Upload a document",
    description: "Add a PDF or Word document to that chat.",
  },
  {
    icon: Mail,
    title: "Ask questions",
    description: `${SITE_NAME} answers using only the content of that document.`,
  },
];

export default function Support() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 py-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Support</h1>
        <p className="text-muted-foreground text-sm">
          How {SITE_NAME} works, and how to reach us if something&apos;s
          wrong.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How it works</CardTitle>
          <CardDescription>
            Upload a PDF or Word document and chat with an AI that answers
            grounded in its content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.title} className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                {index + 1}
              </div>
              <div className="flex flex-col gap-0.5 text-sm">
                <span className="flex items-center gap-1.5 font-medium">
                  <step.icon className="size-4 text-primary" />
                  {step.title}
                </span>
                <span className="text-muted-foreground">
                  {step.description}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact support</CardTitle>
          <CardDescription>
            Stuck, or found a bug? Email us directly and we&apos;ll get back
            to you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            nativeButton={false}
            render={<a href={`mailto:${SUPPORT_EMAIL}`} />}
          >
            <Mail />
            {SUPPORT_EMAIL}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
