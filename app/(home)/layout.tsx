import type { Metadata } from "next";
import { Geist, Lora, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "AskYourDocs - AI",
    template: "%s | AskYourDocs",
  },
  applicationName: "AskYourDocs",
  description:
    "Upload a PDF or Word document and chat with an AI that answers grounded in its content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
