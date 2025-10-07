import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession, clearSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    if (token) {
      // Delete session from database
      await deleteSession(token);
    }

    // Clear session cookie
    await clearSessionCookie();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
