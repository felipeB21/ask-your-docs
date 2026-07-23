import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../globals.css";
import { NOINDEX, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  applicationName: SITE_NAME,
  description: SITE_DESCRIPTION,
  // Thin, transactional pages — no unique search value, keep them out of the index.
  robots: NOINDEX,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
