import "server-only";
import { cookies } from "next/headers";

export type Theme = "light" | "dark";

const THEME_COOKIE = "theme";

export async function getTheme(): Promise<Theme> {
  const store = await cookies();
  return store.get(THEME_COOKIE)?.value === "light" ? "light" : "dark";
}

export async function setTheme(theme: Theme) {
  const store = await cookies();
  store.set(THEME_COOKIE, theme, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
