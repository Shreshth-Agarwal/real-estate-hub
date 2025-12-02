import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { quotes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rfqId = parseInt(id);

    if (isNaN(rfqId)) {
      return NextResponse.json({ error: "Invalid RFQ ID" }, { status: 400 });
    }

    const allQuotes = await db
      .select()
      .from(quotes)
      .where(eq(quotes.rfqId, rfqId));

    return NextResponse.json({ quotes: allQuotes });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const rfqId = parseInt(id);

    if (isNaN(rfqId)) {
      return NextResponse.json({ error: "Invalid RFQ ID" }, { status: 400 });
    }

    const body = await request.json();
    const { price, currency, deliveryEtaDays, notes } = body;

    if (!price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In a real app, get providerId from authenticated session
    const providerId = "placeholder-provider-id";

    const now = new Date().toISOString();
    const [quote] = await db
      .insert(quotes)
      .values({
        rfqId,
        providerId,
        price,
        currency: currency || "INR",
        deliveryEtaDays: deliveryEtaDays || null,
        notes: notes || null,
        status: "pending",
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json({ quote }, { status: 201 });
  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}