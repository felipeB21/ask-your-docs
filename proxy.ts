import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Route group (dashboard) — the only part of the app that requires auth.
const protectedPrefixes = ["/new", "/recents", "/settings", "/upgrade", "/chat"];

// Pages only meant for signed-out visitors; bounce authenticated users to the app.
const authOnlyRoutes = ["/sign-in", "/sign-up"];

function isProtectedRoute(pathname: string) {
  return protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  if (!sessionCookie && isProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (sessionCookie && authOnlyRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/new", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*|favicon.ico).*)"],
};
