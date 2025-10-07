import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user, account } from "@/db/schema";
import { verifyPassword, createSession, setSessionCookie } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const [userData] = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (!userData) {
      return NextResponse.json(
        { error: "Invalid credentials", code: "INVALID_CREDENTIALS" },
        { status: 401 }
      );
    }

    // Get user's account with password
    const [userAccount] = await db
      .select()
      .from(account)
      .where(eq(account.userId, userData.id))
      .limit(1);

    if (!userAccount || !userAccount.password) {
      return NextResponse.json(
        { error: "Invalid credentials", code: "INVALID_CREDENTIALS" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, userAccount.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials", code: "INVALID_CREDENTIALS" },
        { status: 401 }
      );
    }

    // Create session
    const { token } = await createSession(userData.id);

    // Set session cookie
    await setSessionCookie(token);

    return NextResponse.json({
      data: {
        user: userData,
        session: { token },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
