import { NextRequest, NextResponse } from "next/server";

const publicRoutes = [
  "/",
  "/sign-in",
  "/sign-up",
  "/pricing",
  "/knowledge",
  "/onboarding",
];

function isPublicRoute(pathname) {
  if (publicRoutes.includes(pathname)) return true;
  
  if (pathname.startsWith("/knowledge/")) return true;
  if (pathname.startsWith("/api/auth/")) return true;
  if (pathname.startsWith("/_next/")) return true;
  if (pathname.startsWith("/static/")) return true;
  if (pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf)$/)) return true;
  
  return false;
}

function isProtectedRoute(pathname) {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/projects") ||
    pathname.startsWith("/catalogs") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/provider/") ||
    pathname.startsWith("/community") ||
    pathname.startsWith("/rfq")
  );
}

export default function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow public routes without authentication
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check for authentication token (our auth system uses session_token)
  const sessionToken = request.cookies.get("session_token");

  // Redirect unauthenticated users trying to access protected routes
  if (!sessionToken && isProtectedRoute(pathname)) {
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Allow all other requests
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)',
  ],
};