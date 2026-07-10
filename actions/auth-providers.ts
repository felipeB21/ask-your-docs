import { authClient } from "@/lib/auth-client";

type OAuthProvider = "google" | "github";

export const authProviderSignIn = async (provider: OAuthProvider) => {
  await authClient.signIn.social({
    provider: provider,
  });
};
