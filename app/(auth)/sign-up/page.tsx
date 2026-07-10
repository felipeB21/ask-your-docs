import Link from "next/link";

import { AuthLayout } from "@/components/auth/auth-layout";
import { SignUpForm } from "@/components/auth/sign-up";

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Get started with AskYourPdf in seconds"
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthLayout>
  );
}
