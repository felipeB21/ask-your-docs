import type { Metadata } from "next";
import Link from "next/link";

import { AuthLayout } from "@/components/auth/auth-layout";
import { SignInForm } from "@/components/auth/sign-in";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your AskYourDocs account.",
};

export default function SignInPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to AskYourPdf"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </>
      }
    >
      <SignInForm />
    </AuthLayout>
  );
}
