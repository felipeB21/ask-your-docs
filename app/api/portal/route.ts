import { CustomerPortal } from "@polar-sh/nextjs";
import { getSession } from "@/lib/session-helper";

export const GET = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: (process.env.POLAR_SERVER as "sandbox" | "production") ?? "sandbox",
  getExternalCustomerId: async () => {
    const session = await getSession();
    if (!session?.user) throw new Error("Not authenticated");
    return session.user.id;
  },
  returnUrl: `${process.env.BETTER_AUTH_URL}/upgrade`,
});
