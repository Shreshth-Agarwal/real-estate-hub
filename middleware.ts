import type { Session } from "better-auth/types";
import { NextResponse, type NextRequest } from "next/server";

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/pricing",
  "/sign-in",
  "/sign-up",
];

// Check if path matches public route patterns
function isPublicRoute(pathname: string): boolean {
  // Exact matches
  if (publicRoutes.includes(pathname)) return true;
  
  // Pattern matches
  if (pathname.startsWith("/knowledge/")) return true;
  if (pathname.startsWith("/legal/")) return true;
  if (pathname.startsWith("/auth/")) return true;
  if (pathname.startsWith("/api/")) return true;
  if (pathname.startsWith("/_next/")) return true;
  
  return false;
}

// Get redirect URL based on user role
async function getRoleBasedRedirect(request: NextRequest): Promise<string> {
  const sessionToken = request.cookies.get("better-auth.session_token");
  
  if (!sessionToken) {
    return "/dashboard"; // Default fallback
  }

  // Fetch user data to determine role
  try {
    const response = await fetch(`${request.nextUrl.origin}/api/auth/session`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    if (response.ok) {
      const data = await response.json();
      const userId = data?.session?.userId;

      if (userId) {
        // Fetch user type from users API
        const userResponse = await fetch(`${request.nextUrl.origin}/api/users?id=${userId}`, {
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          const userType = userData?.userType;

          if (userType === "provider") return "/provider/dashboard";
          if (userType === "admin") return "/admin";
          if (userType === "consumer") return "/dashboard";
        }
      }
    }
  } catch (error) {
    console.error("Error fetching user role:", error);
  }

  return "/dashboard"; // Default fallback
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

  // Role-based access control
  // Providers trying to access consumer routes should be redirected
  if (pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard")) {
    const roleRedirect = await getRoleBasedRedirect(request);
    if (roleRedirect !== "/dashboard" && pathname === "/dashboard") {
      return NextResponse.redirect(new URL(roleRedirect, request.url));
    }
  }

  // Consumers trying to access provider routes should be blocked
  if (pathname.startsWith("/provider/")) {
    try {
      const response = await fetch(`${request.nextUrl.origin}/api/auth/session`, {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const userId = data?.session?.userId;

        if (userId) {
          const userResponse = await fetch(`${request.nextUrl.origin}/api/users?id=${userId}`);
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            const userType = userData?.userType;

            if (userType !== "provider" && userType !== "admin") {
              return NextResponse.redirect(new URL("/dashboard", request.url));
            }
          }
        }
      }
    } catch (error) {
      console.error("Error checking user role:", error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};