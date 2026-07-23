import type { Metadata } from "next";
import { Geist, Lora, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { requireUser } from "@/lib/session-helper";
import { getSubscription, isProStatus } from "@/lib/subscription";
import { checkDocumentLimit, checkMessageLimit } from "@/lib/limits";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/sidebar";
import { Providers } from "@/components/providers";
import { ChatTitle } from "@/components/dashboard/chat/chat-title";
import { NOINDEX, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

const fontSans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const fontSerif = Lora({ subsets: ["latin"], variable: "--font-serif" });
const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  applicationName: SITE_NAME,
  description: SITE_DESCRIPTION,
  // Authenticated app — nothing here has search value, and it's already gated by proxy.ts.
  robots: NOINDEX,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser();
  const [subscription, documentLimit, messageLimit] = await Promise.all([
    getSubscription(user.id),
    checkDocumentLimit(user.id),
    checkMessageLimit(user.id),
  ]);
  const plan = isProStatus(subscription?.status) ? "pro" : "free";

  return (
    <html lang="en">
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased dark`}
      >
        <Providers>
          <SidebarProvider className="h-svh">
            <AppSidebar
              user={user}
              plan={plan}
              documentLimit={documentLimit}
              messageLimit={messageLimit}
            />
            <SidebarInset className="min-h-0">
              <div className="flex items-center gap-3 px-10 pt-5 shrink-0">
                <SidebarTrigger />
                <ChatTitle />
              </div>
              <main className="p-10 flex-1 min-h-0 overflow-hidden">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
