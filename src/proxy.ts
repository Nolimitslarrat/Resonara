import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";

const PROTECTED_ROUTES: Record<string, Role[]> = {
  "/dashboard": ["SUPER_ADMIN", "MANAGING_EDITOR", "REVIEWER", "AUTHOR", "PRODUCTION"],
  "/dashboard/journals": ["SUPER_ADMIN", "MANAGING_EDITOR"],
  "/dashboard/users": ["SUPER_ADMIN"],
  "/dashboard/analytics": ["SUPER_ADMIN", "MANAGING_EDITOR"],
  "/dashboard/logs": ["SUPER_ADMIN"],
  "/dashboard/settings": ["SUPER_ADMIN"],
  "/dashboard/production": ["SUPER_ADMIN", "PRODUCTION"],
  "/dashboard/issues": ["SUPER_ADMIN", "PRODUCTION"],
  "/dashboard/doi": ["SUPER_ADMIN", "PRODUCTION"],
  "/dashboard/editorial": ["SUPER_ADMIN", "MANAGING_EDITOR"],
  "/dashboard/reviewers": ["SUPER_ADMIN", "MANAGING_EDITOR"],
  "/dashboard/articles": ["SUPER_ADMIN", "MANAGING_EDITOR"],
};

export default auth((req) => {
  const { nextUrl, auth: session } = req as typeof req & { auth: typeof req.auth };
  const isLoggedIn = !!session;
  const pathname = nextUrl.pathname;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/forgot-password");
  const isDashboard = pathname.startsWith("/dashboard");

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isDashboard && isLoggedIn && session?.user?.role) {
    const userRole = session.user.role as Role;
    for (const [route, roles] of Object.entries(PROTECTED_ROUTES)) {
      if (pathname.startsWith(route) && !roles.includes(userRole)) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
