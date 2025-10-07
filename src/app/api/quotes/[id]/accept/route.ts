import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { quotes, rfqRequests } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quoteId = parseInt(params.id);
    const now = new Date().toISOString();

    // Update quote status
    const [updatedQuote] = await db
      .update(quotes)
      .set({ status: "accepted" })
      .where(eq(quotes.id, quoteId))
      .returning();

    if (!updatedQuote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    // Update RFQ status
    await db
      .update(rfqRequests)
      .set({ 
        status: "accepted",
        updatedAt: now 
      })
      .where(eq(rfqRequests.id, updatedQuote.rfqId));

    return NextResponse.json({ quote: updatedQuote });
  } catch (error) {
    console.error("Error accepting quote:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}