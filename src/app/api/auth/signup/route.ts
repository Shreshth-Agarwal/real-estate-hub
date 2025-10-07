import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user, account } from "@/db/schema";
import { hashPassword, createSession, setSessionCookie } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, userType } = body;

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // Validate userType if provided
    const validUserTypes = ['consumer', 'provider', 'admin'];
    const finalUserType = userType && validUserTypes.includes(userType) ? userType : 'consumer';

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists", code: "USER_ALREADY_EXISTS" },
        { status: 400 }
      );
    }

    // Create user
    const userId = crypto.randomUUID();
    const passwordHash = await hashPassword(password);

    await db.insert(user).values({
      id: userId,
      email,
      name,
      userType: finalUserType,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create account with password
    const accountId = crypto.randomUUID();
    await db.insert(account).values({
      id: accountId,
      accountId: userId,
      providerId: "credential",
      userId,
      password: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create session
    const { token } = await createSession(userId);

    // Set session cookie
    await setSessionCookie(token);

    // Get the created user
    const [createdUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    return NextResponse.json({
      data: {
        user: createdUser,
        session: { token },
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
