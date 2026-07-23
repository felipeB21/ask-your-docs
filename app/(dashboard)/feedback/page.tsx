import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FeedbackForm } from "@/components/dashboard/feedback/feedback-form";

export default function Feedback() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 py-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Feedback</h1>
        <p className="text-muted-foreground text-sm">
          Tell us what&apos;s working, what isn&apos;t, or what you&apos;d
          like to see next.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Send feedback</CardTitle>
          <CardDescription>
            We read every submission and reply if you leave something worth
            following up on.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeedbackForm />
        </CardContent>
      </Card>
    </div>
  );
}
