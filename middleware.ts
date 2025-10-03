import type { Session } from "better-auth/types";
import { NextResponse, type NextRequest } from "next/server";

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/pricing",
  "/sign-in",
  "/sign-up",
  "/auth",
];

// Check if path matches public route patterns
function isPublicRoute(pathname: string): boolean {
  // Exact matches
  if (publicRoutes.includes(pathname)) return true;
  
  // Pattern matches
  if (pathname.startsWith("/knowledge/")) return true;
  if (pathname.startsWith("/legal/")) return true;
  if (pathname.startsWith("/auth/")) return true;
  
  return false;
}

// Get redirect URL based on user role
function getRoleBasedRedirect(userType: string | undefined): string {
  if (userType === "provider") return "/provider/dashboard";
  if (userType === "admin") return "/admin";
  return "/dashboard";
}

export default async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check authentication via cookie
  const sessionToken = request.cookies.get("better-auth.session_token");

  // If not authenticated, redirect to sign-in with next parameter
  if (!sessionToken) {
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};