import Link from "next/link";
import Logo from "./logo";

type NavLink = {
  label: string;
  href: string;
};

const NAV_LINKS: NavLink[] = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Features", href: "/#capabilities" },
  { label: "Pricing", href: "/pricing" },
];

export default function Header() {
  return (
    <header className="fixed top-5 w-full px-10 z-99">
      <div className="max-w-6xl mx-auto rounded-full flex items-center border border-foreground py-3 px-6 bg-primary">
        <div className="flex-1 flex justify-start">
          <Logo />
        </div>

        <nav aria-label="Primary" className="flex-1 flex justify-center">
          <ul className="hidden items-center gap-6 sm:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.label} className="text-sm text-foreground">
                <Link
                  href={link.href}
                  className="hover:opacity-80 transition-opacity"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex-1 flex items-center justify-end gap-1 text-sm">
          <Link
            href="/sign-in"
            className="p-2 w-24 text-center font-medium hover:bg-accent/50 rounded-full transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="bg-foreground p-2 w-24 text-center rounded-full text-accent font-medium hover:bg-foreground/90 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
