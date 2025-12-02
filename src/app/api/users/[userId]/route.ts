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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await request.json();

    console.log("🔄 [USER API] Updating user:", {
      userId,
      updates: body,
      timestamp: new Date().toISOString(),
    });

    // Check if user exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!existingUser || existingUser.length === 0) {
      console.error("❌ [USER API] User not found for update:", {
        userId,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update user data
    const updateData: Record<string, any> = {};
    
    if (body.userType) updateData.userType = body.userType;
    if (body.name) updateData.name = body.name;
    if (body.email) updateData.email = body.email;
    if (body.locale) updateData.locale = body.locale;

    await db
      .update(user)
      .set(updateData)
      .where(eq(user.id, userId));

    console.log("✅ [USER API] User updated successfully:", {
      userId,
      updatedFields: Object.keys(updateData),
      timestamp: new Date().toISOString(),
    });

    // Fetch updated user data
    const updatedUser = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    return NextResponse.json({
      id: updatedUser[0].id,
      email: updatedUser[0].email,
      name: updatedUser[0].name,
      user_type: updatedUser[0].userType,
      locale: updatedUser[0].locale,
    });
  } catch (error) {
    console.error("❌ [USER API UPDATE ERROR]:", {
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