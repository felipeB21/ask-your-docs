import { ArrowUpRight, Info } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen bg-accent">
      <div className="container mx-auto p-10">
        <div className="mt-42">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-foreground font-bold xl:text-6xl md:text-5xl text-3xl max-w-4xl text-center text-pretty">
              Talk with your{" "}
              <span className="font-extrabold xl:text-7xl md:text-6xl text-4xl">
                PDF
              </span>{" "}
              and{" "}
              <span className="font-extrabold xl:text-7xl md:text-6xl text-4xl">
                DOCUMENTS
              </span>{" "}
            </h1>
            <div className="mt-12 flex items-center justify-center gap-5">
              <Link
                href="/sign-in"
                className="flex items-center justify-center gap-2 p-2 rounded-full bg-primary w-60 hover:bg-primary/60 transition-colors font-medium text-accent"
              >
                Get Started
                <ArrowUpRight className="w-6 h-6" />
              </Link>

              <Link
                href="/sign-in"
                className="flex items-center justify-center gap-2 p-2 rounded-full w-60 hover:bg-primary/10 transition-colors font-medium"
              >
                Learn About
                <Info className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
