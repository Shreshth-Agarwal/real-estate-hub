import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  console.log("🔐 [OAUTH CALLBACK] Received callback:", {
    hasCode: !!code,
    hasState: !!state,
    error: error || null,
    timestamp: new Date().toISOString(),
    url: request.url,
  });

  // Handle OAuth errors
  if (error) {
    console.error("❌ [OAUTH ERROR] OAuth provider error:", {
      error,
      description: searchParams.get("error_description"),
      timestamp: new Date().toISOString(),
    });

    return NextResponse.redirect(
      new URL(
        `/sign-in?error=${encodeURIComponent(error)}`,
        request.url
      )
    );
  }

  if (!code) {
    console.error("❌ [OAUTH ERROR] No authorization code received");
    return NextResponse.redirect(
      new URL("/sign-in?error=no_code", request.url)
    );
  }

  try {
    console.log("🔄 [OAUTH] Starting token exchange...");

    // Exchange code for tokens using better-auth's built-in handler
    // Better-auth will handle the token exchange and create/update the user
    const response = await auth.handler(request);
    
    // Get the session from the response
    const session = await auth.api.getSession({
      headers: response.headers,
    });

    console.log("✅ [OAUTH] Token exchange successful:", {
      userId: session?.user?.id,
      email: session?.user?.email,
      timestamp: new Date().toISOString(),
    });

    if (!session?.user) {
      console.error("❌ [OAUTH ERROR] No user session after token exchange");
      return NextResponse.redirect(
        new URL("/sign-in?error=session_failed", request.url)
      );
    }

    // Check if user exists and validate role
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    console.log("🔍 [VALIDATION] User lookup:", {
      userId: session.user.id,
      found: existingUser.length > 0,
      userType: existingUser[0]?.user_type || null,
      timestamp: new Date().toISOString(),
    });

    // For NEW users (first time OAuth)
    if (existingUser.length === 0 || !existingUser[0].user_type) {
      console.log("👤 [NEW USER] First-time OAuth user, redirecting to onboarding");
      
      // Redirect to onboarding to select role
      return NextResponse.redirect(
        new URL("/onboarding", request.url)
      );
    }

    // For RETURNING users - validate role
    const userType = existingUser[0].user_type;

    console.log("🔍 [VALIDATION] Checking user role:", {
      userId: session.user.id,
      userType,
      timestamp: new Date().toISOString(),
    });

    // Block provider/shop/admin from OAuth login if they're not consumers
    if (userType === "provider" || userType === "admin") {
      console.error("🚫 [VALIDATION FAILED] Non-consumer attempted OAuth login:", {
        userId: session.user.id,
        email: session.user.email,
        userType,
        timestamp: new Date().toISOString(),
      });

      // Return 403 error for non-consumers
      return new NextResponse(
        JSON.stringify({
          error: "Sign-Up restricted to consumers only",
          message: "Provider and admin accounts must use email/password authentication",
          userType,
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("✅ [VALIDATION PASSED] Consumer user validated:", {
      userId: session.user.id,
      email: session.user.email,
      userType,
      timestamp: new Date().toISOString(),
    });

    // Redirect to dashboard for valid consumer users
    const redirectUrl = new URL("/dashboard", request.url);
    
    console.log("🎯 [REDIRECT] Sending user to dashboard:", {
      userId: session.user.id,
      redirectUrl: redirectUrl.toString(),
      timestamp: new Date().toISOString(),
    });

    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error("❌ [OAUTH ERROR] Token exchange failed:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.redirect(
      new URL(
        `/sign-in?error=${encodeURIComponent("oauth_failed")}`,
        request.url
      )
    );
  }
}