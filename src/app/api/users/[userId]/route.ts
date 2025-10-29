import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user, account } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    console.log("🔍 [USER API] Fetching user data:", {
      userId,
      timestamp: new Date().toISOString(),
    });

    // Fetch user data
    const userData = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!userData || userData.length === 0) {
      console.error("❌ [USER API] User not found:", {
        userId,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch user's OAuth accounts
    const userAccounts = await db
      .select()
      .from(account)
      .where(eq(account.userId, userId));

    console.log("✅ [USER API] User data fetched:", {
      userId,
      hasAccounts: userAccounts.length > 0,
      accountCount: userAccounts.length,
      providers: userAccounts.map(acc => acc.providerId),
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      id: userData[0].id,
      email: userData[0].email,
      name: userData[0].name,
      user_type: userData[0].userType,
      accounts: userAccounts.map(acc => ({
        providerId: acc.providerId,
        accountId: acc.accountId,
      })),
    });
  } catch (error) {
    console.error("❌ [USER API ERROR]:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}