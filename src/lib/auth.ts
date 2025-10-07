import { db } from "@/db";
import { user, session, account } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const SALT_ROUNDS = 10;
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

// Hash a password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Verify a password against its hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Create a new session for a user
export async function createSession(userId: string): Promise<{ token: string; sessionId: string }> {
  const token = crypto.randomUUID();
  const sessionId = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DURATION);

  await db.insert(session).values({
    id: sessionId,
    userId,
    token,
    expiresAt,
    createdAt: now,
    updatedAt: now,
  });

  return { token, sessionId };
}

// Verify a session token and return the session if valid
export async function verifySession(token: string) {
  const [sessionData] = await db
    .select()
    .from(session)
    .where(eq(session.token, token))
    .limit(1);

  if (!sessionData) {
    return null;
  }

  // Check if session is expired
  if (new Date() > sessionData.expiresAt) {
    // Delete expired session
    await db.delete(session).where(eq(session.id, sessionData.id));
    return null;
  }

  return sessionData;
}

// Get the current user from a session token
export async function getCurrentUser(token: string) {
  const sessionData = await verifySession(token);
  
  if (!sessionData) {
    return null;
  }

  const [userData] = await db
    .select()
    .from(user)
    .where(eq(user.id, sessionData.userId))
    .limit(1);

  return userData || null;
}

// Get the current user from cookies (for server components)
export async function getCurrentUserFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) {
    return null;
  }

  return getCurrentUser(token);
}

// Delete a session (logout)
export async function deleteSession(token: string) {
  await db.delete(session).where(eq(session.token, token));
}

// Set session cookie
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION / 1000, // in seconds
    path: "/",
  });
}

// Clear session cookie
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("session_token");
}

// Server-side auth check for protected pages
export async function requireAuth(): Promise<NonNullable<Awaited<ReturnType<typeof getCurrentUserFromCookies>>>> {
  const { redirect } = await import("next/navigation");
  const user = await getCurrentUserFromCookies();
  
  if (!user) {
    redirect("/sign-in");
    throw new Error("Redirecting to sign-in");
  }
  
  return user;
}
