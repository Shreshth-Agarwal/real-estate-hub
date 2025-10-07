import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { ratings } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { targetType, targetId, score, reviewMd } = body;

    if (!targetType || !targetId || !score) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (score < 1 || score > 5) {
      return NextResponse.json(
        { error: "Score must be between 1 and 5" },
        { status: 400 }
      );
    }

    // In a real app, you'd get raterId from the authenticated session
    const raterId = 1; // Placeholder

    const now = new Date().toISOString();
    const [rating] = await db
      .insert(ratings)
      .values({
        raterId,
        targetType,
        targetId,
        score,
        reviewMd: reviewMd || null,
        createdAt: now,
      })
      .returning();

    return NextResponse.json({ rating }, { status: 201 });
  } catch (error) {
    console.error("Error creating rating:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetType = searchParams.get("targetType");
    const targetId = searchParams.get("targetId");

    if (!targetType || !targetId) {
      return NextResponse.json(
        { error: "Missing targetType or targetId" },
        { status: 400 }
      );
    }

    const allRatings = await db
      .select()
      .from(ratings)
      .where(
        and(
          eq(ratings.targetType, targetType),
          eq(ratings.targetId, parseInt(targetId))
        )
      );

    return NextResponse.json({ ratings: allRatings });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}