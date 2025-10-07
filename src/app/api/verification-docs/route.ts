import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { verificationDocs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { docType, docUrl, ocrJson } = body;

    if (!docType || !docUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In a real app, get userId from authenticated session
    const userId = 1; // Placeholder

    const now = new Date().toISOString();
    const [document] = await db
      .insert(verificationDocs)
      .values({
        userId,
        docType,
        docUrl,
        ocrJson: ocrJson || null,
        status: "pending",
        reviewedBy: null,
        reviewedAt: null,
        createdAt: now,
      })
      .returning();

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    console.error("Error uploading verification document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In a real app, get userId from authenticated session
    const userId = 1; // Placeholder

    const docs = await db
      .select()
      .from(verificationDocs)
      .where(eq(verificationDocs.userId, userId));

    return NextResponse.json({ documents: docs });
  } catch (error) {
    console.error("Error fetching verification documents:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}