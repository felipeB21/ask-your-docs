import Link from "next/link";
import Logo from "./logo";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row md:px-10">
        <Logo width={20} height={20} />
        <p className="text-sm text-muted-foreground">
          Chat with any document and get instant, grounded answers.
        </p>
        <nav aria-label="Footer" className="flex items-center gap-5 text-sm text-muted-foreground">
          <Link href="/#how-it-works" className="hover:text-foreground transition-colors">
            How it works
          </Link>
          <Link href="/pricing" className="hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="/sign-in" className="hover:text-foreground transition-colors">
            Sign in
          </Link>
        </nav>
      </div>
      <p className="pb-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AskYourDocs. All rights reserved.
      </p>
    </footer>
  );
}
