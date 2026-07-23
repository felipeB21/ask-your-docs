"use server";

import { setTheme as setThemeCookie, type Theme } from "@/lib/theme";

export async function setTheme(theme: Theme) {
  await setThemeCookie(theme);
}
